"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search, Users, PlusCircle, UserPlus, Lock, Unlock, X,
  CheckCircle, XCircle, ChevronLeft, Shield,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewState = "onboarding" | "create" | "join" | "creatorDashboard";

interface Application {
  id: number;
  applicantName: string;
  applicantHandle: string;
  reason: string;
  status: "pending" | "accepted" | "rejected";
}

interface Club {
  id: number;
  name: string;
  description: string;
  genres: string[];
  members: number;
  isPublic: boolean;
  createdByCurrentUser?: boolean;
  applications?: Application[];
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const GENRES = [
  "Science Fiction", "Fantasy", "Mystery", "Romance",
  "Non-Fiction", "Thriller", "Historical Fiction", "Horror",
];

const INITIAL_CLUBS: Club[] = [
  {
    id: 1,
    name: "Galactic Explorers",
    description: "Diving deep into the best hard sci-fi and space operas.",
    genres: ["Science Fiction", "Thriller"],
    members: 89,
    isPublic: true,
  },
  {
    id: 2,
    name: "The History Buffs",
    description: "Exploring the past through well-researched historical fiction.",
    genres: ["Historical Fiction", "Non-Fiction"],
    members: 100,
    isPublic: true,
  },
  {
    id: 3,
    name: "Midnight Mysteries",
    description: "We only read books that keep us up at night.",
    genres: ["Mystery", "Thriller", "Horror"],
    members: 34,
    isPublic: false,
  },
  {
    id: 4,
    name: "Modern Romantics",
    description: "A safe space to gush over our favorite romance tropes and HEAs.",
    genres: ["Romance"],
    members: 62,
    isPublic: true,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookClubsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view") as ViewState | null;

  const [clubs, setClubs] = useState<Club[]>(INITIAL_CLUBS);

  const hasManagedClub = clubs.some((c) => c.createdByCurrentUser);

  useEffect(() => {
    // If the user visits the base route (/book-clubs) without a view parameter, 
    // and they have an active managed club, auto-redirect to their dashboard.
    // We use router.replace to prevent adding the base /book-clubs route to the history stack.
    if (!viewParam && hasManagedClub) {
      router.replace("/book-clubs?view=creatorDashboard");
    }
  }, [viewParam, hasManagedClub, router]);

  const view: ViewState = viewParam && ["onboarding", "create", "join", "creatorDashboard"].includes(viewParam) 
    ? viewParam 
    : (hasManagedClub ? "creatorDashboard" : "onboarding");

  const setView = (newView: ViewState) => {
    if (newView === "onboarding") {
      router.push("/book-clubs");
    } else {
      router.push(`/book-clubs?view=${newView}`);
    }
  };

  // Create Form State
  const [createName, setCreateName] = useState("");
  const [createDesc, setCreateDesc] = useState("");
  const [createIsPublic, setCreateIsPublic] = useState(true);
  const [createGenres, setCreateGenres] = useState<string[]>([]);

  // Join Discovery State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");

  // Apply Modal State
  const [applyTargetClub, setApplyTargetClub] = useState<Club | null>(null);
  const [applyReason, setApplyReason] = useState("");
  const [applySubmitted, setApplySubmitted] = useState(false);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const toggleGenre = (genre: string) =>
    setCreateGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClub: Club = {
      id: Date.now(),
      name: createName,
      description: createDesc,
      genres: createGenres,
      members: 1,
      isPublic: createIsPublic,
      createdByCurrentUser: true,
      applications: [],
    };
    setClubs((prev) => [newClub, ...prev]);
    setCreateName(""); setCreateDesc(""); setCreateGenres([]); setCreateIsPublic(true);
    setView("onboarding");
  };

  const handleApplySubmit = () => {
    setApplySubmitted(true);
  };

  const handleApplicationAction = (clubId: number, appId: number, action: "accepted" | "rejected") => {
    setClubs((prev) =>
      prev.map((club) => {
        if (club.id !== clubId) return club;
        return {
          ...club,
          applications: club.applications?.map((app) =>
            app.id === appId ? { ...app, status: action } : app
          ),
        };
      })
    );
  };

  // Filtered Clubs
  const filteredClubs = clubs.filter((club) => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "All" || club.genres.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  // Clubs this user created (that are private)
  const myManagedClubs = clubs.filter((c) => c.createdByCurrentUser);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="w-full">

      {/* ── ONBOARDING ─────────────────────────────────────────────────────── */}
      {view === "onboarding" && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Header Section */}
          <div className="text-center space-y-4 max-w-3xl mx-auto pt-10">
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-text-primary tracking-tight">
              Find Your Tribe
            </h1>
            <p className="font-sans text-lg text-text-secondary leading-relaxed">
              Whether you're looking to lead a new literary expedition or join an existing circle of avid readers, your community awaits.
            </p>
          </div>

          {/* If the user manages any clubs, show a creator dashboard shortcut */}
          {myManagedClubs.length > 0 && (
            <div className="flex justify-center">
              <button
                onClick={() => setView("creatorDashboard")}
                className="flex items-center gap-2 px-6 py-3 bg-bg-card border border-accent-gold/20 text-accent-gold hover:bg-accent-gold/10 rounded-full font-sans text-sm font-medium transition-all shadow-lg shadow-accent-gold/5"
              >
                <Shield size={16} /> My Creator Dashboard
              </button>
            </div>
          )}

          {/* Cards Section */}
          <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-5xl mx-auto pb-16 px-4 sm:px-6 lg:px-8">
            {/* Start a Book Club Card */}
            <button
              onClick={() => setView("create")}
              className="group relative flex-1 rounded-[2.5rem] overflow-hidden text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent-gold/20 border border-white/5"
            >
              <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&fit=crop" 
                  alt="Start a Book Club" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
              </div>
              <div className="relative z-10 p-10 h-full flex flex-col justify-end min-h-[420px]">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent-gold/20 group-hover:border-accent-gold/50 transition-all duration-500">
                  <PlusCircle className="text-white group-hover:text-accent-gold transition-colors duration-500" size={32} />
                </div>
                <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">Host a Realm</h2>
                <p className="font-sans text-white/80 text-lg leading-relaxed max-w-sm">
                  Create a new sanctuary for your friends or open the doors for fellow enthusiasts to discover.
                </p>
                <div className="mt-8 flex items-center text-accent-gold font-sans font-semibold text-sm uppercase tracking-widest opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                  Start a Club <span className="ml-2">→</span>
                </div>
              </div>
            </button>

            {/* Join a Book Club Card */}
            <button
              onClick={() => setView("join")}
              className="group relative flex-1 rounded-[2.5rem] overflow-hidden text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent-gold/20 border border-white/5"
            >
              <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&fit=crop" 
                  alt="Join a Book Club" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
              </div>
              <div className="relative z-10 p-10 h-full flex flex-col justify-end min-h-[420px]">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent-gold/20 group-hover:border-accent-gold/50 transition-all duration-500">
                  <UserPlus className="text-white group-hover:text-accent-gold transition-colors duration-500" size={32} />
                </div>
                <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">Join a Fellowship</h2>
                <p className="font-sans text-white/80 text-lg leading-relaxed max-w-sm">
                  Discover vibrant, active communities dissecting the exact same genres you already love.
                </p>
                <div className="mt-8 flex items-center text-accent-gold font-sans font-semibold text-sm uppercase tracking-widest opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                  Find a Club <span className="ml-2">→</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ── CREATE ─────────────────────────────────────────────────────────── */}
      {view === "create" && (
        <div className="max-w-3xl mx-auto bg-bg-card border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative">
          <button onClick={() => setView("onboarding")} className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors">
            <X size={24} />
          </button>

          <h2 className="font-playfair text-3xl font-bold text-text-primary mb-2">Create Book Club</h2>
          <p className="font-sans text-text-secondary mb-8 pb-8 border-b border-white/5">
            Define the rules, select your genres, and prepare to host.
          </p>

          <form onSubmit={handleCreateSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="font-sans text-sm font-medium text-text-primary uppercase tracking-wider">Club Name</label>
              <input
                type="text" required
                placeholder="e.g. Midnight Library Enthusiasts"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                className="w-full bg-bg-secondary border border-white/10 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="font-sans text-sm font-medium text-text-primary uppercase tracking-wider">Description</label>
              <textarea
                required rows={3}
                placeholder="What kind of books will you read? Who is this club for?"
                value={createDesc}
                onChange={(e) => setCreateDesc(e.target.value)}
                className="w-full bg-bg-secondary border border-white/10 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-colors resize-none"
              />
            </div>

            <div className="space-y-3">
              <label className="font-sans text-sm font-medium text-text-primary uppercase tracking-wider">Visibility</label>
              <div className="flex gap-4">
                <button type="button" onClick={() => setCreateIsPublic(true)}
                  className={`flex-1 flex flex-col items-center p-4 rounded-xl border transition-all ${createIsPublic ? "border-accent-gold bg-accent-gold/5" : "border-white/10 bg-bg-secondary"}`}
                >
                  <Unlock className={`mb-2 ${createIsPublic ? "text-accent-gold" : "text-text-muted"}`} size={24} />
                  <span className={`font-sans font-medium ${createIsPublic ? "text-accent-gold" : "text-text-secondary"}`}>Open for all</span>
                </button>
                <button type="button" onClick={() => setCreateIsPublic(false)}
                  className={`flex-1 flex flex-col items-center p-4 rounded-xl border transition-all ${!createIsPublic ? "border-accent-gold bg-accent-gold/5" : "border-white/10 bg-bg-secondary"}`}
                >
                  <Lock className={`mb-2 ${!createIsPublic ? "text-accent-gold" : "text-text-muted"}`} size={24} />
                  <span className={`font-sans font-medium ${!createIsPublic ? "text-accent-gold" : "text-text-secondary"}`}>Private</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="font-sans text-sm font-medium text-text-primary uppercase tracking-wider">Target Genres</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <button key={genre} type="button" onClick={() => toggleGenre(genre)}
                    className={`px-4 py-2 rounded-full text-sm font-sans font-medium transition-all ${createGenres.includes(genre) ? "bg-accent-gold text-bg-primary" : "bg-bg-secondary text-text-secondary border border-white/10 hover:border-white/30"}`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-accent-gold/10 border border-accent-gold/20 rounded-xl p-4 flex items-start gap-4">
              <Users className="text-accent-gold mt-1 shrink-0" size={20} />
              <div>
                <h4 className="font-sans font-bold text-accent-gold">Capacity Constraint Enforced</h4>
                <p className="font-sans text-sm text-accent-gold/80 mt-1">
                  All book clubs are strictly capped at a maximum of <strong>100 unique members</strong>.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <button type="submit"
                className="w-full bg-accent-gold text-bg-primary py-4 rounded-xl font-sans font-bold hover:bg-accent-amber transition-colors shadow-lg shadow-accent-gold/20"
              >
                Launch Book Club
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── JOIN (DISCOVERY) ───────────────────────────────────────────────── */}
      {view === "join" && (
        <div className="max-w-6xl mx-auto">
          {/* Back + Search Row */}
          <div className="mb-10">
            <button onClick={() => setView("onboarding")}
              className="flex items-center gap-2 text-text-muted hover:text-white font-sans text-sm transition-colors mb-6"
            >
              <ChevronLeft size={16} /> Back
            </button>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96 flex-shrink-0">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-accent-gold" />
                </div>
                <input
                  type="text"
                  placeholder="Search clubs by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-bg-card border border-white/10 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-colors font-sans"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <span className="text-sm font-sans text-text-secondary whitespace-nowrap shrink-0">Filter:</span>
                {["All", ...GENRES.slice(0, 5)].map((g) => (
                  <button key={g} onClick={() => setSelectedGenre(g)}
                    className={`px-4 py-2 rounded-full text-sm font-sans font-medium whitespace-nowrap transition-all ${selectedGenre === g ? "bg-accent-gold text-bg-primary" : "bg-bg-card text-text-secondary border border-white/10 hover:bg-white/5"}`}
                  >
                    {g === "All" ? "All Genres" : g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Club Cards */}
          {filteredClubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map((club) => {
                const isFull = club.members >= 100;
                return (
                  <div key={club.id} className="bg-bg-card border border-white/5 rounded-2xl p-6 flex flex-col hover:border-accent-gold/30 transition-colors shadow-lg">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-fraunces text-xl font-bold text-text-primary">{club.name}</h3>
                      {club.isPublic
                        ? <Unlock size={16} className="text-text-muted shrink-0 mt-1" />
                        : <Lock size={16} className="text-text-muted shrink-0 mt-1" />}
                    </div>

                    <p className="font-sans text-text-secondary text-sm mb-5 flex-1">{club.description}</p>

                    {/* Genre Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {club.genres.map((g) => (
                        <span key={g} className="px-2.5 py-1 bg-bg-secondary rounded-md text-xs font-sans text-text-muted border border-white/5">
                          {g}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users size={15} className={isFull ? "text-red-400" : "text-accent-gold"} />
                        <span className={`font-sans text-sm font-medium ${isFull ? "text-red-400" : "text-text-primary"}`}>
                          Members: {club.members}/100
                        </span>
                      </div>

                      {/* Conditional Action Button */}
                      {isFull ? (
                        <span className="px-4 py-2 rounded-lg font-sans text-sm font-bold bg-bg-secondary text-text-muted cursor-not-allowed">
                          Full
                        </span>
                      ) : club.isPublic ? (
                        <button className="px-4 py-2 rounded-lg font-sans text-sm font-bold bg-accent-gold/20 text-accent-gold hover:bg-accent-gold hover:text-bg-primary transition-all">
                          Join
                        </button>
                      ) : (
                        <button
                          onClick={() => { setApplyTargetClub(club); setApplyReason(""); setApplySubmitted(false); }}
                          className="px-4 py-2 rounded-lg font-sans text-sm font-bold bg-white/5 text-text-primary border border-white/10 hover:border-accent-gold/50 hover:text-accent-gold transition-all flex items-center gap-1.5"
                        >
                          <Lock size={13} /> Apply
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-bg-card rounded-2xl border border-white/5">
              <Search className="mx-auto text-text-muted mb-4" size={40} />
              <h3 className="font-fraunces text-xl text-text-primary mb-2">No clubs found</h3>
              <p className="font-sans text-text-secondary">Try adjusting your search or genre filters.</p>
            </div>
          )}
        </div>
      )}

      {/* ── CREATOR DASHBOARD ──────────────────────────────────────────────── */}
      {view === "creatorDashboard" && (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <button onClick={() => setView("onboarding")}
                className="flex items-center gap-2 text-text-muted hover:text-white font-sans text-sm transition-colors mb-3"
              >
                <ChevronLeft size={16} /> Back
              </button>
              <h2 className="font-playfair text-3xl font-bold text-text-primary flex items-center gap-3">
                <Shield className="text-accent-gold" size={28} /> Creator Dashboard
              </h2>
              <p className="font-sans text-text-secondary mt-1">Manage applications to your private book clubs.</p>
            </div>
          </div>

          {myManagedClubs.map((club) => {
            const pending = club.applications?.filter((a) => a.status === "pending") ?? [];
            const resolved = club.applications?.filter((a) => a.status !== "pending") ?? [];

            return (
              <div key={club.id} className="mb-12">
                {/* Club Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 bg-accent-gold/10 rounded-lg flex items-center justify-center shrink-0">
                    <Lock className="text-accent-gold" size={18} />
                  </div>
                  <div>
                    <h3 className="font-fraunces text-xl text-text-primary">{club.name}</h3>
                    <p className="font-sans text-xs text-text-muted">{club.members}/100 members · Private Club</p>
                  </div>
                  <div className="ml-auto">
                    <span className="px-3 py-1 bg-accent-gold/10 text-accent-gold border border-accent-gold/20 rounded-full text-xs font-sans font-bold">
                      {pending.length} Pending
                    </span>
                  </div>
                </div>

                {/* Pending Applications */}
                {pending.length === 0 ? (
                  <div className="text-center py-12 bg-bg-card rounded-2xl border border-white/5 text-text-muted font-sans">
                    No pending applications at this time.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pending.map((app) => (
                      <div key={app.id} className="bg-bg-card border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          {/* Applicant Info */}
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-11 h-11 rounded-full bg-bg-secondary border border-white/10 flex items-center justify-center shrink-0 font-fraunces text-lg text-accent-gold">
                              {app.applicantName[0]}
                            </div>
                            <div className="min-w-0">
                              <p className="font-sans font-bold text-text-primary">{app.applicantName}</p>
                              <p className="font-sans text-xs text-text-muted">{app.applicantHandle}</p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => handleApplicationAction(club.id, app.id, "accepted")}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 font-sans text-sm font-bold transition-all"
                            >
                              <CheckCircle size={15} /> Accept
                            </button>
                            <button
                              onClick={() => handleApplicationAction(club.id, app.id, "rejected")}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 font-sans text-sm font-bold transition-all"
                            >
                              <XCircle size={15} /> Reject
                            </button>
                          </div>
                        </div>

                        {/* Reason */}
                        <div className="mt-4 pt-4 border-t border-white/5">
                          <p className="font-sans text-xs text-text-muted uppercase tracking-wider mb-2">Application Reason</p>
                          <p className="font-sans text-sm text-text-secondary leading-relaxed italic">
                            &ldquo;{app.reason}&rdquo;
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Resolved Applications */}
                {resolved.length > 0 && (
                  <div className="mt-6">
                    <p className="font-sans text-xs text-text-muted uppercase tracking-wider mb-3">Resolved</p>
                    <div className="space-y-2">
                      {resolved.map((app) => (
                        <div key={app.id} className="bg-bg-card/50 border border-white/5 rounded-xl px-5 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-bg-secondary border border-white/10 flex items-center justify-center font-fraunces text-sm text-accent-gold shrink-0">
                              {app.applicantName[0]}
                            </div>
                            <p className="font-sans text-sm text-text-secondary">{app.applicantName} <span className="text-text-muted">({app.applicantHandle})</span></p>
                          </div>
                          <span className={`font-sans text-xs font-bold px-3 py-1 rounded-full ${app.status === "accepted" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                            {app.status === "accepted" ? "Accepted" : "Rejected"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── APPLY MODAL (Dialog) ────────────────────────────────────────────── */}
      <Dialog
        open={!!applyTargetClub}
        onOpenChange={(open) => { if (!open) setApplyTargetClub(null); }}
      >
        <DialogContent>
          {!applySubmitted ? (
            <>
              <DialogHeader>
                <DialogTitle>Apply to Join</DialogTitle>
                <DialogDescription>
                  <span className="text-accent-gold font-medium">&ldquo;{applyTargetClub?.name}&rdquo;</span> is a private club. Tell the creator why you&apos;d be a great fit.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-2">
                <label className="font-sans text-sm font-medium text-text-primary block mb-2">
                  Why do you want to join this particular book club?
                </label>
                <textarea
                  rows={5}
                  placeholder="Share what draws you to this club, your reading interests, or what you hope to contribute..."
                  value={applyReason}
                  onChange={(e) => setApplyReason(e.target.value)}
                  className="w-full bg-bg-secondary border border-white/10 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-colors resize-none font-sans text-sm"
                />
              </div>

              <DialogFooter>
                <button
                  onClick={() => setApplyTargetClub(null)}
                  className="px-5 py-2.5 rounded-xl font-sans text-sm text-text-secondary bg-bg-secondary border border-white/10 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={!applyReason.trim()}
                  onClick={handleApplySubmit}
                  className="px-5 py-2.5 rounded-xl font-sans text-sm font-bold bg-accent-gold text-bg-primary hover:bg-accent-amber disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-accent-gold/20"
                >
                  Submit Application
                </button>
              </DialogFooter>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="text-emerald-400" size={36} />
              </div>
              <DialogTitle className="text-center mb-3">Application Sent!</DialogTitle>
              <DialogDescription className="text-center">
                Your application to <span className="text-accent-gold font-medium">&ldquo;{applyTargetClub?.name}&rdquo;</span> has been submitted. The creator will review it shortly.
              </DialogDescription>
              <button
                onClick={() => setApplyTargetClub(null)}
                className="mt-6 px-6 py-3 rounded-xl font-sans text-sm font-bold bg-accent-gold text-bg-primary hover:bg-accent-amber transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
