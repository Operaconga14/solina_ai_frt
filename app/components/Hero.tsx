import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-violet-300 mb-8 border border-violet-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Your AI Co-Founder — From Idea to Investor-Ready</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            Build Your Startup <span className="text-gradient">10x Faster</span>
            <br />
            with AI
          </h1>

          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Solirna AI is an autonomous startup co-founder agent — conducting research, generating
            documents, validating ideas, and helping you move from concept to fundable company at
            unprecedented speed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="btn-primary text-base px-8 py-3 rounded-xl inline-flex items-center gap-2 shadow-lg shadow-violet-900/40"
            >
              Start Building Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="glass glass-hover text-white/70 hover:text-white text-base px-8 py-3 rounded-xl transition-all"
            >
              Sign in to your account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
