"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const allGenres = [
  "Fantasy", "Sci-Fi", "Romance", "Mystery", "Non-Fiction", 
  "Horror", "Literary Fiction", "Self-Help", "History", "Biography"
];

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          genres: selectedGenres
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="font-fraunces text-3xl text-text-primary mb-2">Join the Club</h1>
        <p className="font-sans text-text-secondary text-sm">Create an account to track your reading journey.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-md bg-accent-rose/10 border border-accent-rose/20 text-accent-rose text-sm font-sans animate-shake">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-sans text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-bg-card border border-white/10 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-gold transition-colors font-sans text-sm"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block font-sans text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Username</label>
            <input 
              type="text" 
              required
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full bg-bg-card border border-white/10 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-gold transition-colors font-sans text-sm"
              placeholder="@janereads"
            />
          </div>
        </div>

        <div>
          <label className="block font-sans text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Email</label>
          <input 
            type="email" 
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-bg-card border border-white/10 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-gold transition-colors font-sans text-sm"
            placeholder="reader@example.com"
          />
        </div>

        <div>
          <label className="block font-sans text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Password</label>
          <input 
            type="password" 
            required
            minLength={6}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full bg-bg-card border border-white/10 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-gold transition-colors font-sans text-sm"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block font-sans text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Favorite Genres</label>
          <div className="flex flex-wrap gap-2">
            {allGenres.map(genre => (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={`px-3 py-1.5 rounded-full text-xs font-sans transition-colors border ${
                  selectedGenres.includes(genre) 
                    ? 'bg-accent-gold text-bg-primary border-accent-gold font-bold' 
                    : 'bg-bg-secondary text-text-secondary border-white/5 hover:border-white/20 hover:text-text-primary'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-accent-gold text-bg-primary font-sans font-bold py-3 rounded-lg hover:bg-accent-amber transition-colors disabled:opacity-50 flex justify-center items-center gap-2 mt-6"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          Create Account
        </button>
      </form>

      <p className="mt-8 text-center text-sm font-sans text-text-muted">
        Already have an account? <Link href="/login" className="text-accent-gold hover:text-accent-amber font-medium transition-colors">Sign in</Link>
      </p>
    </div>
  );
}
