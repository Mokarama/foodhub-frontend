'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/src/context/AuthContext';
import { Loading } from '@/src/components/ui';

/**
 * Admin index page — redirects to admin users page
 */
export default function AdminPage() {
  const { user, isLoading, isAuthenticated } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || user?.role !== 'ADMIN') {
        router.push('/dashboard');
      } else {
        router.push('/admin/users');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  return <Loading />;
}
