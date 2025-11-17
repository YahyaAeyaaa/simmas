import { requireAuth } from '@/app/lib/auth/middleware';
import DashboardLayout from '@/app/layout/layout';
import type { ReactNode } from 'react';

export default async function GuruLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Only allow guru role
  const session = await requireAuth(['guru' , 'admin']);
  
  return (
    <DashboardLayout 
      userName={session.name} 
      userRole={session.role}
    >
      {children}
    </DashboardLayout>
  );
}