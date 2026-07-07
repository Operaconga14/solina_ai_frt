import {
  Brain,
  Building2,
  Clock,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Presentation,
  Settings,
  TrendingUp,
  User2,
  Zap,
} from 'lucide-react';
import axios from 'axios';

const passwordStrenght = (pwd: string) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};

const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/chat', icon: MessageSquare, label: 'AI Chat' },
  { href: '/companies', icon: Building2, label: 'Companies' },
  { href: '/prd', icon: FileText, label: 'PRD Generator' },
  { href: '/pitchdeck', icon: Presentation, label: 'Pitch Deck' },
];

const profileDropdown = [
  { href: '/account', icon: User2, label: 'Account' },
  { href: '/notifications', icon: MessageSquare, label: 'Notification' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

const quickActions = [
  {
    href: '/chat',
    icon: MessageSquare,
    label: 'AI Chat',
    desc: 'Talk with your AI co-founder',
    gradient: 'from-violet-600/20 to-purple-600/10',
    border: 'border-violet-500/20',
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-400',
  },
  {
    href: '/companies',
    icon: Building2,
    label: 'Companies',
    desc: 'Manage your ventures',
    gradient: 'from-blue-600/20 to-cyan-600/10',
    border: 'border-blue-500/20',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    href: '/prd',
    icon: FileText,
    label: 'PRD Generator',
    desc: 'Generate product requirements',
    gradient: 'from-emerald-600/20 to-teal-600/10',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    href: '/pitchdeck',
    icon: Presentation,
    label: 'Pitch Deck',
    desc: 'Build investor-ready decks',
    gradient: 'from-amber-600/20 to-orange-600/10',
    border: 'border-amber-500/20',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
  },
];

const tips = [
  { icon: Brain, text: 'Ask Solirna to validate your startup idea using SWOT analysis' },
  { icon: Zap, text: 'Generate a complete PRD in seconds with a single prompt' },
  { icon: TrendingUp, text: 'Use the pitch deck generator to create investor-ready slides' },
  { icon: Clock, text: 'Solirna remembers your entire startup journey across sessions' },
];

const statCards = (stats: any) => [
  { label: 'Companies', value: stats?.companies ?? 0, icon: Building2, color: 'text-blue-400' },
  { label: 'PRDs Created', value: stats?.prds ?? 0, icon: FileText, color: 'text-emerald-400' },
  {
    label: 'Pitch Decks',
    value: stats?.pitchDecks ?? 0,
    icon: Presentation,
    color: 'text-amber-400',
  },
  {
    label: 'Chat Messages',
    value: stats?.chatMessages ?? 0,
    icon: MessageSquare,
    color: 'text-violet-400',
  },
];

const formatTime = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const starterPrompts = [
  'Validate my startup idea: [describe your idea]',
  'Conduct a SWOT analysis for my startup',
  "What's the market size for [your industry]?",
  'Help me identify my target customer persona',
  'What are the key risks I should consider?',
  'How should I price my SaaS product?',
];

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const BaseUrl = 'https://solirnaai-production.up.railway.app';

const api = axios.create({
  baseURL: BaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export {
  passwordStrenght,
  quickActions,
  statCards,
  tips,
  strengthColor,
  strengthLabel,
  navItems,
  profileDropdown,
  starterPrompts,
  formatTime,
  formatDate,
  BaseUrl,
  api,
};
