"use server";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

export interface GoogleBookVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
      medium?: string;
      large?: string;
      extraLarge?: string;
    };
    publishedDate?: string;
    categories?: string[];
    industryIdentifiers?: Array<{ type: string; identifier: string }>;
    averageRating?: number;
    ratingsCount?: number;
    pageCount?: number;
  };
}

const MOCK_FALLBACK: GoogleBookVolume[] = [
  {
    id: "mock-1",
    volumeInfo: {
      title: "Atomic Habits (Mock Fallback)",
      authors: ["James Clear"],
      description: "No matter your goals, Atomic Habits offers a proven framework for improving--every day. *Note: You are seeing this fallback because the Google Books API returned a 503 Service Unavailable error.*",
      imageLinks: { thumbnail: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400&auto=format&fit=crop" },
      publishedDate: "2018"
    }
  },
  {
    id: "mock-2",
    volumeInfo: {
      title: "Dune (Mock Fallback)",
      authors: ["Frank Herbert"],
      description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange.",
      imageLinks: { thumbnail: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=400&auto=format&fit=crop" },
      publishedDate: "1965"
    }
  }
];

export async function searchBooks(query: string, maxResults = 12): Promise<GoogleBookVolume[]> {
  if (!query) return [];
  
  try {
    const res = await fetch(`${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${maxResults}`);
    if (!res.ok) {
        if (res.status === 503) {
            console.warn("Google Books API 503. Using Mock Fallback.");
            return MOCK_FALLBACK;
        }
        throw new Error(`Google Books API responded with status ${res.status}`);
    }
    const data = await res.json();
    return data.items || MOCK_FALLBACK;
  } catch (error) {
    console.warn("Error searching books, using fallback:", error);
    return MOCK_FALLBACK;
  }
}

export async function getBookById(id: string): Promise<GoogleBookVolume | null> {
  if (!id) return null;
  
  if (id.startsWith("mock-")) {
      return MOCK_FALLBACK.find(b => b.id === id) || null;
  }

  if (id.startsWith("search-")) {
    const query = decodeURIComponent(id.replace("search-", ""));
    const results = await searchBooks(query, 1);
    if (results && results.length > 0) {
      return { ...results[0], id }; // Keep original ID for routing consistency
    }
    return MOCK_FALLBACK[0];
  }

  try {
    const res = await fetch(`${GOOGLE_BOOKS_API}/${id}`);
    if (!res.ok) {
        if (res.status === 503) return MOCK_FALLBACK[0];
        return null;
    }
    const data = await res.json();
    if (data.error) return null;
    return data as GoogleBookVolume;
  } catch (error) {
    console.error(`Error fetching book with id ${id}:`, error);
    return MOCK_FALLBACK[0];
  }
}
