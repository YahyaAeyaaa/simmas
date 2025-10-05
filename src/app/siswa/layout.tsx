import { requireAuth } from '@/app/lib/auth/middleware';
import DashboardLayout from '@/app/layout/layout';
import type { ReactNode } from 'react';

export default async function SiswaLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Only allow siswa role
  const session = await requireAuth(['siswa']);
  
  return (
    <DashboardLayout 
      userName={session.name} 
      userRole={session.role}
    >
      {children}
    </DashboardLayout>
  );
}