"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Loader2, Book } from "lucide-react";
import { searchBooks, GoogleBookVolume } from "@/lib/google-books";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GoogleBookVolume[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await searchBooks(query);
        setResults(data);
      } catch (err) {
        console.error("Failed to search books", err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTime = setTimeout(fetchBooks, 500);
    return () => clearTimeout(debounceTime);
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Search Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-text-primary mb-6">
          Find Your Next Great Read
        </h1>
        
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-accent-gold" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 md:py-5 border-2 border-white/10 rounded-2xl leading-5 bg-bg-card text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold sm:text-lg transition-all shadow-xl font-sans"
            placeholder="Search by title, author, or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <Loader2 className="h-5 w-5 text-accent-gold animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {results.map((book) => {
            const cover = book.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:');
            return (
              <Link href={`/book/${book.id}`} key={book.id} className="group flex flex-col items-start space-y-3">
                <div className="w-full aspect-[2/3] bg-bg-secondary rounded-lg shadow-lg overflow-hidden relative border border-white/5 group-hover:border-accent-gold/50 transition-colors">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover}
                      alt={book.volumeInfo.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted bg-bg-card">
                      <Book size={48} opacity={0.5} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div>
                  <h3 className="font-fraunces font-bold text-text-primary line-clamp-1 group-hover:text-accent-gold transition-colors">
                    {book.volumeInfo.title}
                  </h3>
                  <p className="font-sans text-xs text-text-secondary line-clamp-1">
                    {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                  </p>
                  <p className="font-sans text-[10px] text-text-muted mt-1 uppercase tracking-wider">
                    {book.volumeInfo.publishedDate?.substring(0,4)}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && query && results.length === 0 && (
        <div className="text-center py-20 text-text-muted">
          <Book size={48} className="mx-auto mb-4 opacity-50" />
          <p className="font-sans text-lg">No books found matching "{query}"</p>
        </div>
      )}

    </div>
  );
}
