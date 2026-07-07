'use client';
import { DashboardStats } from '@/app/types/interfaces';
import { quickActions, statCards, tips } from '@/app/utils/helpers';
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  return (
    <div className="p-6 lg:p-8  mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-glow" />
          <span className="text-xs text-white/40 font-medium uppercase tracking-widest">
            Solirna AI Active
          </span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-black text-white mb-2">
          Good{' '}
          {new Date().getHours() < 12
            ? 'morning'
            : new Date().getHours() < 18
              ? 'afternoon'
              : 'evening'}
          {/* , <span className="text-gradient">{firstName}</span> 👋 */}
        </h1>
        <p className="text-white/40">Your AI co-founder is ready. What are we building today?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {statCards(stats).map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4 card-glow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/40 font-medium">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-3xl font-black text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white/80 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`glass glass-hover rounded-2xl p-5 border ${action.border} bg-gradient-to-br ${action.gradient} group transition-all duration-200 card-glow`}
            >
              <div
                className={`w-10 h-10 rounded-xl ${action.iconBg} flex items-center justify-center mb-4`}
              >
                <action.icon className={`w-5 h-5 ${action.iconColor}`} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{action.label}</h3>
              <p className="text-xs text-white/45 mb-3">{action.desc}</p>
              <div className="flex items-center gap-1 text-xs text-white/30 group-hover:text-white/60 transition-colors">
                <span>Open</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tips & Hero Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tips */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 card-glow">
          <h2 className="text-base font-semibold text-white/80 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            Pro Tips
          </h2>
          <div className="space-y-3">
            {tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <tip.icon className="w-4 h-4 text-violet-400" />
                </div>
                <p className="text-sm text-white/55 leading-relaxed pt-1.5">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Card */}
        <div className="glass rounded-2xl p-6 bg-gradient-to-br from-violet-600/15 to-indigo-600/10 border border-violet-500/20 card-glow flex flex-col">
          <div className="flex-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-900/50">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Start a conversation</h3>
            <p className="text-sm text-white/45 leading-relaxed mb-6">
              Your AI co-founder is ready to help you validate ideas, research markets, and build
              your startup.
            </p>
          </div>
          <Link
            href="/chat"
            className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Chat with Solirna
          </Link>
        </div>
      </div>
    </div>
  );
}
