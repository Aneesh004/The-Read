"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

interface WishlistButtonProps {
  bookId: string;
  bookTitle: string;
  bookAuthor?: string;
  bookCover?: string;
  className?: string;
}

export default function WishlistButton({
  bookId,
  bookTitle,
  bookAuthor,
  bookCover,
  className = "",
}: WishlistButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      setChecking(false);
      return;
    }

    const checkWishlist = async () => {
      try {
        const res = await fetch("/api/wishlist");
        if (res.ok) {
          const data = await res.json();
          const found = (data.wishlist ?? []).some((item: any) => item.book_id === bookId);
          setIsWishlisted(found);
        }
      } catch {
        // ignore
      } finally {
        setChecking(false);
      }
    };

    checkWishlist();
  }, [user, bookId]);

  const handleClick = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      if (isWishlisted) {
        await fetch(`/api/wishlist?bookId=${encodeURIComponent(bookId)}`, { method: "DELETE" });
        setIsWishlisted(false);
      } else {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            book_id: bookId,
            book_title: bookTitle,
            book_author: bookAuthor,
            book_cover: bookCover,
            open_library_key: bookId.startsWith("OL") ? bookId : undefined,
          }),
        });
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (checking) return null;

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors font-sans text-sm font-medium disabled:opacity-50 ${
        isWishlisted
          ? "bg-accent-gold/15 border-accent-gold text-accent-gold"
          : "bg-bg-card border-white/10 text-text-secondary hover:border-accent-gold hover:text-accent-gold"
      } ${className}`}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : isWishlisted ? (
        <BookmarkCheck size={16} />
      ) : (
        <Bookmark size={16} />
      )}
      {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
    </button>
  );
}
