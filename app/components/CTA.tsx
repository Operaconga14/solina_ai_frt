import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
  return (
    <>
      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="glass rounded-3xl p-12 text-center border border-violet-500/20 bg-gradient-to-br from-violet-600/10 to-indigo-600/10">
            <h2 className="text-4xl font-black text-white mb-4">Ready to build your startup?</h2>
            <p className="text-white/50 mb-8 text-lg">
              Join hundreds of founders using Solirna AI to validate, build, and fund their
              startups.
            </p>
            <Link
              href="/register"
              className="btn-primary text-base px-10 py-3.5 rounded-xl inline-flex items-center gap-2 shadow-2xl shadow-violet-900/60"
            >
              <Sparkles className="w-5 h-5" />
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
