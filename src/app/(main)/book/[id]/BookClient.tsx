"use client";

import { useEffect, useState } from "react";
import { GoogleBookVolume } from "@/lib/google-books";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface BookClientProps {
  book: GoogleBookVolume;
}

const COLORS = {
  skip: "#8B3A3A",
  okish: "#8C837C",
  good_read: "#C7A069",
  must_read: "#DAA520"
};

const VOTE_LABELS: Record<string, string> = {
  skip: "Skip",
  okish: "Okish",
  good_read: "Good Read",
  must_read: "Must Read"
};

export default function BookClient({ book }: BookClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [distribution, setDistribution] = useState<any[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isVoting, setIsVoting] = useState(false);
  
  const coverUrl = book.volumeInfo.imageLinks?.extraLarge 
    || book.volumeInfo.imageLinks?.large 
    || book.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:');

  const fetchRatings = async () => {
    try {
      const res = await fetch(`/api/ratings?bookId=${book.id}`);
      if (res.ok) {
        const data = await res.json();
        
        if (data.total > 0) {
          const distMap = data.distribution as Record<string, number>;
          const chartData = Object.entries(distMap).map(([key, value]) => ({
            name: VOTE_LABELS[key],
            value: value,
            id: key
          })).filter(item => item.value > 0);
          
          setDistribution(chartData);
          setTotalVotes(data.total);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [book.id]);

  const handleVote = async (value: string) => {
    if (!session) {
      router.push("/login");
      return;
    }
    
    setIsVoting(true);
    try {
      await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book.id,
          value,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors?.[0] || "Unknown",
          coverImage: coverUrl
        })
      });
      await fetchRatings();
    } catch (error) {
      console.error("Failed to vote", error);
    } finally {
      setIsVoting(false);
    }
  };

  // Mock initial data if no real votes exist yet to show beautiful empty state pie chart
  const displayDistribution = totalVotes > 0 ? distribution : [
    { name: "No Votes Yet", value: 1, id: "okish" }
  ];

  return (
    <div className="relative min-h-[90vh]">
      {/* Blurred Background Hero */}
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
        
        {/* Cover & Voting Actions */}
        <div className="shrink-0 space-y-8 flex flex-col items-center lg:items-start select-none">
          {/* Cover Art */}
          <div className="w-64 md:w-80 h-96 md:h-[30rem] rounded-md shadow-2xl flex-shrink-0 relative overflow-hidden ring-1 ring-white/10">
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-bg-card flex justify-center items-center font-sans text-text-muted">No Cover Available</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Voting Buttons */}
          <div className="w-full bg-bg-card border border-white/5 rounded-2xl p-6">
            <h3 className="font-sans font-bold text-text-secondary text-sm uppercase tracking-widest mb-4">Cast Your Vote</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(VOTE_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  disabled={isVoting}
                  onClick={() => handleVote(key)}
                  className="py-3 px-2 rounded-xl text-xs font-sans font-bold border border-white/10 hover:border-accent-gold transition-colors flex justify-center items-center disabled:opacity-50"
                  style={{ color: COLORS[key as keyof typeof COLORS] || "#fff" }}
                >
                  {label}
                </button>
              ))}
            </div>
            {!session && (
              <p className="mt-4 text-xs text-center text-text-muted">
                You must <button onClick={() => router.push("/login")} className="underline text-accent-gold inline-block hover:text-accent-amber">Sign In</button> to vote.
              </p>
            )}
          </div>
        </div>

        {/* Content & Stats */}
        <div className="flex-1 space-y-12">
          {/* Header Info */}
          <div>
            <h1 className="font-playfair text-4xl md:text-6xl font-bold text-text-primary mb-2 mb-4 leading-tight">
              {book.volumeInfo.title}
            </h1>
            <p className="font-sans text-xl text-accent-gold mb-6">
              by <span className="font-medium text-text-secondary">{book.volumeInfo.authors?.join(", ") || "Unknown Author"}</span>
            </p>

            {book.volumeInfo.description && (
              <div 
                className="prose prose-invert prose-p:font-serif prose-p:text-text-muted prose-p:leading-relaxed max-w-2xl"
                dangerouslySetInnerHTML={{ __html: book.volumeInfo.description }}
              />
            )}
          </div>

          {/* The Pie Chart Section */}
          <div className="bg-bg-card/50 border border-white/10 rounded-2xl p-8 max-w-2xl relative overflow-hidden backdrop-blur-sm">
            <h3 className="font-fraunces text-2xl text-text-primary mb-1">Community Verdict</h3>
            <p className="font-sans text-text-muted text-sm mb-6">{totalVotes} ratings from readers</p>
            
            <div className="flex flex-col md:flex-row items-center gap-8 h-64">
              {/* Chart */}
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
                      isAnimationActive={true}
                    >
                      {displayDistribution.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={totalVotes > 0 ? COLORS[entry.id as keyof typeof COLORS] : COLORS.okish} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any) => [`${val} Votes`, '']}
                      contentStyle={{ backgroundColor: '#1A161C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#EAE6E1', fontFamily: 'var(--font-sans)', fontSize: '14px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="space-y-4">
                {totalVotes > 0 ? distribution.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[item.id as keyof typeof COLORS] }} />
                    <span className="font-sans text-sm text-text-primary w-24">{item.name}</span>
                    <span className="font-sans text-xs font-bold text-text-muted w-12 text-right">
                      {Math.round((item.value / totalVotes) * 100)}%
                    </span>
                  </div>
                )) : (
                  <p className="font-sans text-text-muted italic text-sm">Be the first to rate this book!</p>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
