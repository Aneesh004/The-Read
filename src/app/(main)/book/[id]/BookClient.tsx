"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, BookOpen } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import WishlistButton from "@/components/wishlist/WishlistButton";
import BookComments from "@/components/book/BookComments";
import type { OLBook } from "@/lib/open-library";

interface BookClientProps {
  bookId: string;
}

const COLORS = {
  skip: "#8B3A3A",
  okish: "#8C837C",
  good_read: "#C7A069",
  must_read: "#DAA520",
};

const VOTE_LABELS: Record<string, string> = {
  skip: "Skip",
  okish: "Okish",
  good_read: "Good Read",
  must_read: "Must Read",
};

export default function BookClient({ bookId }: BookClientProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [book, setBook] = useState<OLBook | null>(null);
  const [bookLoading, setBookLoading] = useState(true);
  const [bookError, setBookError] = useState(false);

  const [distribution, setDistribution] = useState<any[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isVoting, setIsVoting] = useState(false);

  // Fetch book data client-side
  useEffect(() => {
    const load = async () => {
      setBookLoading(true);
      setBookError(false);
      try {
        let data: OLBook | null = null;

        if (bookId.startsWith("OL")) {
          const res = await fetch(`https://openlibrary.org/works/${bookId}.json`);
          if (res.ok) {
            const raw = await res.json();

            // Fetch up to 3 author names
            const authorKeys: string[] = (raw.authors ?? [])
              .map((a: any) => a.author?.key)
              .filter(Boolean)
              .slice(0, 3);

            const authorNames = await Promise.all(
              authorKeys.map(async (key: string) => {
                try {
                  const r = await fetch(`https://openlibrary.org${key}.json`);
                  if (!r.ok) return "Unknown Author";
                  const a = await r.json();
                  return (a.name as string) ?? "Unknown Author";
                } catch {
                  return "Unknown Author";
                }
              })
            );

            const coverId: number | undefined = raw.covers?.[0];
            const description =
              typeof raw.description === "string"
                ? raw.description
                : raw.description?.value;

            const yearMatch = (raw.first_publish_date ?? "").match(/\d{4}/);

            data = {
              id: bookId,
              title: raw.title ?? "Unknown Title",
              authors: authorNames.length > 0 ? authorNames : ["Unknown Author"],
              description,
              coverUrl: coverId
                ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
                : undefined,
              coverLargeUrl: coverId
                ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
                : undefined,
              publishedYear: yearMatch ? parseInt(yearMatch[0]) : undefined,
              subjects: (raw.subjects ?? []).slice(0, 5),
            };
          }
        } else {
          // Legacy Google Books ID – fetch via Google Books API
          const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
          if (res.ok) {
            const raw = await res.json();
            const vi = raw.volumeInfo ?? {};
            const cover = vi.imageLinks?.thumbnail?.replace("http:", "https:");
            const yearMatch = (vi.publishedDate ?? "").match(/\d{4}/);
            data = {
              id: bookId,
              title: vi.title ?? "Unknown Title",
              authors: vi.authors ?? [],
              description: vi.description,
              coverUrl: cover,
              coverLargeUrl:
                vi.imageLinks?.large?.replace("http:", "https:") ??
                vi.imageLinks?.extraLarge?.replace("http:", "https:") ??
                cover,
              publishedYear: yearMatch ? parseInt(yearMatch[0]) : undefined,
              subjects: vi.categories,
            };
          }
        }

        if (!data) setBookError(true);
        else setBook(data);
      } catch {
        setBookError(true);
      } finally {
        setBookLoading(false);
      }
    };

    load();
  }, [bookId]);

  // Fetch ratings
  const fetchRatings = async () => {
    try {
      const res = await fetch(`/api/ratings?bookId=${bookId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.total > 0) {
          const chartData = Object.entries(data.distribution as Record<string, number>)
            .map(([key, value]) => ({ name: VOTE_LABELS[key], value, id: key }))
            .filter((item) => item.value > 0);
          setDistribution(chartData);
          setTotalVotes(data.total);
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchRatings();
  }, [bookId]);

  const handleVote = async (value: string) => {
    if (!user) { router.push("/login"); return; }
    if (!book) return;
    setIsVoting(true);
    try {
      await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          value,
          title: book.title,
          author: book.authors[0] ?? "Unknown",
          coverImage: book.coverUrl,
        }),
      });
      await fetchRatings();
    } catch {}
    setIsVoting(false);
  };

  // ── Loading ──
  if (bookLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-accent-gold" />
      </div>
    );
  }

  // ── Error ──
  if (bookError || !book) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 text-center px-4">
        <BookOpen size={56} className="text-text-muted opacity-40" />
        <h2 className="font-fraunces text-3xl text-text-primary">Book not found</h2>
        <p className="font-sans text-text-secondary max-w-sm">
          We couldn&apos;t load this book&apos;s details right now. It may have moved in the Open Library database.
        </p>
        <button
          onClick={() => router.back()}
          className="bg-accent-gold text-bg-primary font-sans font-bold px-6 py-3 rounded-full hover:bg-accent-amber transition-colors"
        >
          Go back
        </button>
      </div>
    );
  }

  const coverUrl = book.coverLargeUrl ?? book.coverUrl;
  const displayDistribution = (
    totalVotes > 0 ? distribution : [{ name: "No Votes Yet", value: 1, id: "okish" }]
  ).map((item) => ({
    ...item,
    fill: COLORS[item.id as keyof typeof COLORS] ?? COLORS.okish,
  }));

  return (
    <div className="relative min-h-[90vh]">
      {/* Blurred Background */}
      <div className="absolute inset-0 h-[60vh] overflow-hidden -z-10 bg-bg-primary">
        {coverUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 scale-110"
            style={{ backgroundImage: `url(${coverUrl})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col lg:flex-row gap-12 lg:gap-24">

        {/* Cover & Actions */}
        <div className="shrink-0 space-y-6 flex flex-col items-center lg:items-start select-none">
          <div className="w-64 md:w-80 h-96 md:h-[30rem] rounded-md shadow-2xl flex-shrink-0 relative overflow-hidden ring-1 ring-white/10">
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-bg-card flex justify-center items-center font-sans text-text-muted">
                No Cover Available
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <WishlistButton
            bookId={bookId}
            bookTitle={book.title}
            bookAuthor={book.authors[0]}
            bookCover={book.coverUrl}
            className="w-full justify-center"
          />

          <div className="w-full bg-bg-card border border-white/5 rounded-2xl p-6">
            <h3 className="font-sans font-bold text-text-secondary text-sm uppercase tracking-widest mb-4">
              Cast Your Vote
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(VOTE_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  disabled={isVoting}
                  onClick={() => handleVote(key)}
                  className="py-3 px-2 rounded-xl text-xs font-sans font-bold border border-white/10 hover:border-accent-gold transition-colors flex justify-center items-center disabled:opacity-50"
                  style={{ color: COLORS[key as keyof typeof COLORS] ?? "#fff" }}
                >
                  {isVoting ? <Loader2 size={14} className="animate-spin" /> : label}
                </button>
              ))}
            </div>
            {!user && (
              <p className="mt-4 text-xs text-center text-text-muted">
                You must{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="underline text-accent-gold inline-block hover:text-accent-amber"
                >
                  Sign In
                </button>{" "}
                to vote.
              </p>
            )}
          </div>
        </div>

        {/* Content & Stats */}
        <div className="flex-1 space-y-12">
          <div>
            <h1 className="font-playfair text-4xl md:text-6xl font-bold text-text-primary mb-4 leading-tight">
              {book.title}
            </h1>
            <p className="font-sans text-xl text-accent-gold mb-6">
              by{" "}
              <span className="font-medium text-text-secondary">
                {book.authors.join(", ") || "Unknown Author"}
              </span>
            </p>

            {book.publishedYear && (
              <p className="font-sans text-sm text-text-muted mb-4 uppercase tracking-wider">
                Published {book.publishedYear}
              </p>
            )}

            {book.subjects && book.subjects.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {book.subjects.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 rounded-full bg-bg-card border border-white/5 font-sans text-xs text-text-secondary"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {book.description && (
              <p className="font-serif text-text-muted leading-relaxed max-w-2xl whitespace-pre-line">
                {book.description.replace(/<[^>]*>/g, "")}
              </p>
            )}
          </div>

          {/* Comments */}
          <BookComments bookId={bookId} />

          {/* Community Verdict */}
          <div className="bg-bg-card/50 border border-white/10 rounded-2xl p-8 max-w-2xl relative overflow-hidden backdrop-blur-sm">
            <h3 className="font-fraunces text-2xl text-text-primary mb-1">Community Verdict</h3>
            <p className="font-sans text-text-muted text-sm mb-6">{totalVotes} ratings from readers</p>

            <div className="flex flex-col md:flex-row items-center gap-8 h-64">
              <div className="w-64 h-64 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={displayDistribution}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      isAnimationActive
                    />
                    <Tooltip
                      formatter={(val: any) => [`${val} Votes`, ""]}
                      contentStyle={{
                        backgroundColor: "#1A161C",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "#EAE6E1", fontFamily: "var(--font-sans)", fontSize: "14px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                {totalVotes > 0 ? (
                  distribution.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[item.id as keyof typeof COLORS] }}
                      />
                      <span className="font-sans text-sm text-text-primary w-24">{item.name}</span>
                      <span className="font-sans text-xs font-bold text-text-muted w-12 text-right">
                        {Math.round((item.value / totalVotes) * 100)}%
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="font-sans text-text-muted italic text-sm">
                    Be the first to rate this book!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
