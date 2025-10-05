import { requireAuth } from '@/app/lib/auth/middleware';
import DashboardLayout from '@/app/layout/layout';
import type { ReactNode } from 'react';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Only allow admin role
  const session = await requireAuth(['admin']);
  
  return (
    <DashboardLayout 
      userName={session.name} 
      userRole={session.role}
    >   
    {children}
    </DashboardLayout>
  );
}