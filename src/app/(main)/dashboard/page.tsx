import { MessageSquare, Heart, Share2 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-bg-card border border-white/5 rounded-2xl p-6">
        <h1 className="font-fraunces text-2xl font-bold text-text-primary mb-2">My Feed</h1>
        <p className="font-sans text-sm text-text-secondary">Recent activity from your reading clubs.</p>
      </div>

      {/* Feed Stream */}
      <div className="space-y-6">
        {[1, 2, 3].map((post) => (
          <div key={post} className="bg-bg-card border border-white/5 rounded-2xl p-6 transition-all hover:border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent-gold flex justify-center items-center font-bold text-bg-primary text-sm">
                R{post}
              </div>
              <div>
                <h4 className="font-sans font-bold text-text-primary text-sm">Reader {post}</h4>
                <p className="font-sans text-xs text-text-muted">in Sci-Fi Saturdays • 2 hours ago</p>
              </div>
            </div>
            
            <p className="font-sans text-text-secondary leading-relaxed text-sm mb-6">
              Just finished the latest chapter of our club pick. The twist at the end completely caught me off guard! Who else predicted that outcome?
            </p>

            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
              <button className="flex items-center gap-2 text-text-muted hover:text-accent-rose transition-colors">
                <Heart size={18} />
                <span className="font-sans text-xs font-medium">12</span>
              </button>
              <button className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors">
                <MessageSquare size={18} />
                <span className="font-sans text-xs font-medium">4</span>
              </button>
              <button className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors ml-auto">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
