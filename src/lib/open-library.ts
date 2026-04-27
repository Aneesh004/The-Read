const OL_BASE = "https://openlibrary.org";
const COVERS_BASE = "https://covers.openlibrary.org/b/id";

export interface OLBook {
  id: string;
  title: string;
  authors: string[];
  description?: string;
  coverUrl?: string;
  coverLargeUrl?: string;
  publishedYear?: number;
  subjects?: string[];
}

export function getCoverUrl(coverId: number | undefined, size: "S" | "M" | "L" = "M"): string | undefined {
  if (!coverId) return undefined;
  return `${COVERS_BASE}/${coverId}-${size}.jpg`;
}

export async function searchBooks(query: string, limit = 12): Promise<OLBook[]> {
  if (!query.trim()) return [];

  try {
    const fields = "key,title,author_name,cover_i,first_publish_year,subject";
    const url = `${OL_BASE}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&fields=${fields}`;
    const res = await fetch(url, { next: { revalidate: 300 } });

    if (!res.ok) throw new Error(`Open Library search error: ${res.status}`);

    const data = await res.json();
    return (data.docs ?? []).map((doc: any) => ({
      id: (doc.key as string).replace("/works/", ""),
      title: doc.title ?? "Unknown Title",
      authors: doc.author_name ?? [],
      coverUrl: getCoverUrl(doc.cover_i, "M"),
      coverLargeUrl: getCoverUrl(doc.cover_i, "L"),
      publishedYear: doc.first_publish_year,
      subjects: (doc.subject ?? []).slice(0, 5),
    }));
  } catch (error) {
    console.error("Open Library search error:", error);
    return [];
  }
}

export async function getBookById(id: string): Promise<OLBook | null> {
  if (!id) return null;

  try {
    const res = await fetch(`${OL_BASE}/works/${id}.json`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const data = await res.json();

    // Fetch author names (up to 3)
    const authorKeys: string[] = (data.authors ?? [])
      .map((a: any) => a.author?.key)
      .filter(Boolean)
      .slice(0, 3);

    const authorNames = await Promise.all(
      authorKeys.map(async (key: string) => {
        try {
          const r = await fetch(`${OL_BASE}${key}.json`, { next: { revalidate: 86400 } });
          if (!r.ok) return "Unknown Author";
          const a = await r.json();
          return (a.name as string) ?? "Unknown Author";
        } catch {
          return "Unknown Author";
        }
      })
    );

    const coverId: number | undefined = data.covers?.[0];

    let description: string | undefined;
    if (typeof data.description === "string") {
      description = data.description;
    } else if (data.description?.value) {
      description = data.description.value;
    }

    // Extract year from strings like "1965" or "January 1, 1965"
    const yearMatch = (data.first_publish_date ?? "").match(/\d{4}/);
    const publishedYear = yearMatch ? parseInt(yearMatch[0]) : undefined;

    return {
      id,
      title: data.title ?? "Unknown Title",
      authors: authorNames.length > 0 ? authorNames : ["Unknown Author"],
      description,
      coverUrl: getCoverUrl(coverId, "M"),
      coverLargeUrl: getCoverUrl(coverId, "L"),
      publishedYear,
      subjects: (data.subjects ?? []).slice(0, 5),
    };
  } catch (error) {
    console.error(`Open Library getBookById error for ${id}:`, error);
    return null;
  }
}
