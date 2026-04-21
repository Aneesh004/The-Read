import Link from "next/link";
import { Compass, BookText, Users, Bell, LogOut, Settings } from "lucide-react";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 hidden lg:block space-y-8">
          <div className="bg-bg-card border border-white/5 rounded-2xl p-6 sticky top-24">
            <nav className="space-y-2">
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 text-accent-gold font-sans font-medium hover:bg-white/10 transition-colors">
                <Compass size={18} /> Feed
              </Link>
              <Link href="/search" className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary font-sans font-medium hover:bg-white/5 hover:text-text-primary transition-colors">
                <BookText size={18} /> Discover
              </Link>
              <Link href="/clubs" className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary font-sans font-medium hover:bg-white/5 hover:text-text-primary transition-colors">
                <Users size={18} /> My Clubs
              </Link>
              <Link href="/notifications" className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary font-sans font-medium hover:bg-white/5 hover:text-text-primary transition-colors">
                <Bell size={18} /> Notifications
              </Link>
            </nav>

            <div className="mt-8 pt-8 border-t border-white/10">
              <nav className="space-y-2">
                <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary font-sans font-medium hover:bg-white/5 hover:text-text-primary transition-colors">
                  <Settings size={18} /> Settings
                </Link>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Feed Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

        {/* Right Panel (Trending) */}
        <aside className="w-full lg:w-80 shrink-0 space-y-8 hidden xl:block">
          <div className="bg-bg-card border border-white/5 rounded-2xl p-6 sticky top-24">
            <h3 className="font-fraunces font-bold text-lg text-text-primary mb-4">Trending in Clubs</h3>
            <div className="space-y-4">
              {/* Mock items */}
              {[
                { title: "Dune Discussion", members: 120, active: true },
                { title: "Romance Readers", members: 45, active: false },
                { title: "Sci-Fi Saturdays", members: 312, active: true }
              ].map((club, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-white/5 hover:border-accent-gold/30 transition-colors cursor-pointer group">
                  <div>
                    <h4 className="font-sans font-medium text-text-primary text-sm group-hover:text-accent-gold">{club.title}</h4>
                    <span className="text-xs text-text-muted">{club.members} Members</span>
                  </div>
                  {club.active && (
                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
