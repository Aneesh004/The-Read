"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="w-full">
      <Link href="/login" className="inline-flex items-center gap-2 text-xs font-sans font-medium text-text-muted hover:text-accent-gold transition-colors mb-8">
        <ArrowLeft size={14} /> Back to Sign in
      </Link>

      <div className="mb-10">
        <h1 className="font-fraunces text-3xl text-text-primary mb-2">Reset Password</h1>
        <p className="font-sans text-text-secondary text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {success ? (
        <div className="bg-bg-secondary border border-white/10 rounded-xl p-8 text-center animate-fade-in">
          <div className="w-16 h-16 bg-accent-sage/20 text-accent-sage rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={32} />
          </div>
          <h3 className="font-fraunces text-xl text-text-primary mb-2">Check your email</h3>
          <p className="font-sans text-text-secondary text-sm">
            We've sent a password reset link to <span className="text-text-primary font-medium">{email}</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-sans text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg-card border border-white/10 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-gold transition-colors font-sans text-sm"
              placeholder="reader@example.com"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !email}
            className="w-full bg-accent-gold text-bg-primary font-sans font-bold py-3 rounded-lg hover:bg-accent-amber transition-colors disabled:opacity-50 flex justify-center items-center gap-2 mt-6"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            Send Reset Link
          </button>
        </form>
      )}
    </div>
  );
}
