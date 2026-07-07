'use client';
import { Button } from '@/components/ui/button';
import { ChevronRight, Heading1, Menu, MenuIcon, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { navItems } from '../utils/helpers';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen" style={{ background: 'rgb(10, 10, 16)' }}>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden glass p-2 rounded-xl"
      >
        {mobileOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Menu className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-60 glass border-r border-white/[0.06] transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'rgba(12, 12, 20, 0.97)' }}
      >
        <div className="flex justify-center items-center flex-col py-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-900/60 mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Solirna Ai</h1>
          </div>
        </div>
        {/* Sidebar Content */}
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${active ? 'active' : ''} my-2`}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />

              <span className={`flex-1`}>{item.label}</span>
              {/* {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />} */}
            </Link>
          );
        })}
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:flex flex-col ${!sidebarOpen ? 'w-20' : 'w-60'} flex-shrink-0 border-r border-white/[0.06] h-screen sticky top-0`}
        style={{ background: 'rgba(12, 12, 20, 0.98)' }}
      >
        <div className="flex justify-center items-center flex-col py-6">
          {sidebarOpen ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-900/60 mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Solirna Ai</h1>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-900/60 mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          )}
          <Button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {!sidebarOpen ? <MenuIcon /> : <X />}
          </Button>
        </div>
        {/* Sidebar Content */}
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${active ? 'active' : ''} my-2`}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />

              <span className={`flex-1 ${!sidebarOpen ? 'hidden' : 'block'}`}>{item.label}</span>
              {/* {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />} */}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
