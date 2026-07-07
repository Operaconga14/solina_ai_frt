import { Brain, FileText, Shield, Zap } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: 'Deep Market Research',
      desc: 'Autonomous research agent that maps competitive landscapes and synthesizes trend reports.',
      color: 'from-violet-600/20 to-purple-600/10',
      border: 'border-violet-500/20',
      iconColor: 'text-violet-400',
    },
    {
      icon: FileText,
      title: 'Document Generation',
      desc: 'One-prompt generation of full PRDs, business plans, and investor-grade pitch decks.',
      color: 'from-blue-600/20 to-cyan-600/10',
      border: 'border-blue-500/20',
      iconColor: 'text-blue-400',
    },
    {
      icon: Zap,
      title: 'Idea Validation Engine',
      desc: 'SWOT, Jobs-to-be-Done, and Blue Ocean frameworks applied automatically to validate concepts.',
      color: 'from-emerald-600/20 to-teal-600/10',
      border: 'border-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    {
      icon: Shield,
      title: 'Persistent Startup Memory',
      desc: 'Long-term context retention — Solirna remembers your pivots, decisions, and constraints.',
      color: 'from-amber-600/20 to-orange-600/10',
      border: 'border-amber-500/20',
      iconColor: 'text-amber-400',
    },
  ];
  return (
    <>
      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Everything you need to launch</h2>
            <p className="text-white/40">
              Comprehensive AI tools built for solo founders and indie hackers
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className={`glass rounded-2xl p-6 border ${f.border} bg-gradient-to-br ${f.color} transition-all duration-300 hover:-translate-y-1 card-glow`}
              >
                <div
                  className={`w-10 h-10 rounded-xl glass mb-4 flex items-center justify-center ${f.iconColor}`}
                >
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
