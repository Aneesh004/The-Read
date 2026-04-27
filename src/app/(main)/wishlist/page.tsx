import Link from "next/link";
import { Bookmark, Book } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function WishlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: wishlist } = await supabase
    .from("wishlist")
    .select("*")
    .eq("user_id", user.id)
    .order("added_at", { ascending: false });

  const items = wishlist ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Bookmark className="text-accent-gold" size={28} />
          <h1 className="font-playfair text-4xl font-bold text-text-primary">My Wishlist</h1>
        </div>
        <p className="font-sans text-text-secondary">
          {items.length} {items.length === 1 ? "book" : "books"} saved
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 text-text-muted">
          <Book size={56} className="mx-auto mb-4 opacity-40" />
          <p className="font-fraunces text-2xl text-text-secondary mb-3">Your wishlist is empty</p>
          <p className="font-sans text-sm mb-8">Start adding books you want to read.</p>
          <Link
            href="/search"
            className="inline-block bg-accent-gold text-bg-primary font-sans font-bold px-6 py-3 rounded-full hover:bg-accent-amber transition-colors"
          >
            Discover Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {items.map((item: any) => (
            <Link
              href={`/book/${item.book_id}`}
              key={item.id}
              className="group flex flex-col items-start space-y-3"
            >
              <div className="w-full aspect-[2/3] bg-bg-secondary rounded-lg shadow-lg overflow-hidden relative border border-white/5 group-hover:border-accent-gold/50 transition-colors">
                {item.book_cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.book_cover}
                    alt={item.book_title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted bg-bg-card">
                    <Book size={40} opacity={0.4} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div>
                <h3 className="font-fraunces font-bold text-text-primary line-clamp-2 group-hover:text-accent-gold transition-colors text-sm">
                  {item.book_title}
                </h3>
                {item.book_author && (
                  <p className="font-sans text-xs text-text-secondary line-clamp-1 mt-0.5">
                    {item.book_author}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
