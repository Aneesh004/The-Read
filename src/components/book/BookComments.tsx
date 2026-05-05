"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquare, Send } from "lucide-react";

interface Comment {
  id: string;
  text: string;
  user_name: string;
  created_at: string;
}

export default function BookComments({ bookId }: { bookId: string }) {
  const { user } = useAuth();
  const router = useRouter();

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?bookId=${bookId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComments(); }, [bookId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, text }),
      });
      if (res.ok) {
        setText("");
        await fetchComments();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare size={20} className="text-accent-gold" />
        <h3 className="font-fraunces text-2xl text-text-primary">
          Reader Comments
        </h3>
        {!loading && (
          <span className="font-sans text-sm text-text-muted">({comments.length})</span>
        )}
      </div>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts on this book…"
            rows={3}
            className="w-full bg-bg-card border border-white/10 rounded-xl px-4 py-3 font-sans text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-accent-gold/50 transition-colors"
          />
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="self-end flex items-center gap-2 bg-accent-gold text-bg-primary font-sans font-bold text-sm px-5 py-2.5 rounded-full hover:bg-accent-amber transition-colors disabled:opacity-50"
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Post
          </button>
        </form>
      ) : (
        <p className="font-sans text-sm text-text-muted">
          <button
            onClick={() => router.push("/login")}
            className="underline text-accent-gold hover:text-accent-amber"
          >
            Sign in
          </button>{" "}
          to leave a comment.
        </p>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="animate-spin text-accent-gold" />
        </div>
      ) : comments.length === 0 ? (
        <p className="font-sans text-sm text-text-muted italic">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="bg-bg-card border border-white/5 rounded-xl px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans font-semibold text-sm text-text-primary">{c.user_name}</span>
                <span className="font-sans text-xs text-text-muted">{formatDate(c.created_at)}</span>
              </div>
              <p className="font-sans text-sm text-text-secondary leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
