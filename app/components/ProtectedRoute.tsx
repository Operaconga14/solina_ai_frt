'use client';
import { useAuth } from '../contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ChatSkeleton } from './SkeletonsLine';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push('/login');
      } else if (pathname === '/login' || pathname === '/register') {
        // Already logged in, redirect to dashboard
        router.push('/dashboard');
      }
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ChatSkeleton />
      </div>
    );
  }

  // Only show children if user is authenticated OR if on login/register and not authenticated
  const isAuthPage = pathname === '/login' || pathname === '/register';
  if (!user && !isAuthPage) {
    return null; // Will redirect soon
  }
  if (user && isAuthPage) {
    return null; // Will redirect soon
  }

  return <>{children}</>;
}
