import { Building2, ChevronRight, FileText, MessageSquare, Presentation } from 'lucide-react';
import Link from 'next/link';

export default function Tools() {
  const tools = [
    {
      icon: MessageSquare,
      label: 'AI Chat',
      href: '/chat',
      desc: 'Strategic co-founder conversations',
    },
    { icon: Building2, label: 'Companies', href: '/companies', desc: 'Manage your ventures' },
    { icon: FileText, label: 'PRD Generator', href: '/prd', desc: 'Investor-grade product docs' },
    {
      icon: Presentation,
      label: 'Pitch Deck',
      href: '/pitchdeck',
      desc: 'Compelling investor decks',
    },
  ];
  return (
    <>
      {/* Tools Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Your AI Toolkit</h2>
            <p className="text-white/40">Four powerful tools to take you from zero to fundable</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tools.map((t) => (
              <Link
                key={t.href}
                href="/register"
                className="glass glass-hover rounded-2xl p-6 flex items-center gap-5 group transition-all duration-200 card-glow"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/30 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <t.icon className="w-6 h-6 text-violet-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white mb-1">{t.label}</h3>
                  <p className="text-sm text-white/45">{t.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
