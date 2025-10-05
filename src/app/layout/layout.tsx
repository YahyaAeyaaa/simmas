'use client';

import { useState, ReactNode } from 'react';
import Sidebar from '@/components/sidebar/sidebar';
import Navbar from '@/components/navbar/navbar';
import { SchoolSettingsProvider } from '@/app/context/SchoolSettingsContext';

interface DashboardLayoutProps {
  children: ReactNode;
  userName?: string;
  userRole: 'admin' | 'guru' | 'siswa';
}

const DashboardLayout = ({ 
  children, 
  userName, 
  userRole 
}: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SchoolSettingsProvider>
      <div className="flex min-h-screen">
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          userRole={userRole} // PASS ROLE KE SIDEBAR
        />
        
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 xl:hidden"
          />
        )}

        <div className="flex-1 xl:ml-64 flex flex-col">
          <Navbar 
            onMenuClick={() => setSidebarOpen(true)}
            userName={userName}
            userRole={userRole}
          />

          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SchoolSettingsProvider>
  );
};

export default DashboardLayout;