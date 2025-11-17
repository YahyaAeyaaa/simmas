'use client';

import { Users, LayoutDashboard, GraduationCap, Building2, BookOpen  } from 'lucide-react';
import HeaderCard from '@/components/common/headerCard';
import Card from '@/components/common/Card'
import LogbookCard from '@/components/common/LogBookCard';
import DudiCard from '@/components/common/DudiCard';
import MagangCard from '@/components/common/MagangCard';
import { useEffect, useState } from 'react';
import { adminDashboardService, AdminDashboardStats, MagangTerbaru, DudiAktif } from '@/app/service/adminDashboardService';

export default function Dashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [magangTerbaru, setMagangTerbaru] = useState<MagangTerbaru[]>([]);
  const [dudiAktif, setDudiAktif] = useState<DudiAktif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, magangData, dudiData] = await Promise.all([
          adminDashboardService.getDashboardStats(),
          adminDashboardService.getMagangTerbaru(),
          adminDashboardService.getDudiAktif(),
        ]);

        setStats(statsData);
        setMagangTerbaru(magangData);
        setDudiAktif(dudiData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <>
    <div className='bg-gray-50 p-6 min-h-screen'>
      <HeaderCard 
        title="Dashboard Admin"
        subtitle="Selamat datang kembali!"
        variant='gradient'
        icon={<LayoutDashboard className="w-8 h-8 text-white" />}
      />
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
            title="Total Siswa"
            total={loading ? 0 : stats?.totalSiswa || 0}
            icon={<Users className='text-cyan-500'/>}
            subtitle="Seluruh Siswa Terdaftar"
        />
        <Card 
            title="Total Dudi"
            total={loading ? 0 : stats?.totalDudi || 0}
            icon={<Building2 className='text-cyan-500'/>}
            subtitle="Perusahaan Partner"
        />
        <Card 
            title="Magang Aktif"
            total={loading ? 0 : stats?.magangAktif || 0}
            icon={<GraduationCap className='text-cyan-500'/>}
            subtitle="Sedang Magang"
        />
        <Card 
            title="Logbook Pending"
            total={loading ? 0 : stats?.logbookPending || 0}
            icon={<BookOpen className='text-cyan-500'/>}
            subtitle="Menunggu Verifikasi"
        />
        </div>
    </div>
        {/* Magang Terbaru & Dudi Aktif Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6'>
          {/* Magang Terbaru Card */}
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <GraduationCap className='text-[#970747]'/>
              <p className='font-semibold text-sm'>Magang Terbaru</p>
            </div>
            
            <div className='max-h-96 overflow-y-auto pr-2'>
              {loading ? (
                <p className="text-sm text-gray-500">Memuat data...</p>
              ) : magangTerbaru.length > 0 ? (
                magangTerbaru.map((magang) => (
                  <MagangCard 
                    key={magang.id}
                    studentName={magang.studentName}
                    companyName={magang.companyName}
                    startDate={formatDate(magang.startDate)}
                    endDate={formatDate(magang.endDate)}
                    status={magang.status}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">Belum ada data magang</p>
              )}
            </div>
          </div>

          {/* Dudi Aktif Card */}
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <Building2 className='text-[#970747]'/>
              <p className='font-semibold text-sm'>Dudi Aktif</p>
            </div>
            
            <div className='max-h-96 overflow-y-auto pr-2'>
              {loading ? (
                <p className="text-sm text-gray-500">Memuat data...</p>
              ) : dudiAktif.length > 0 ? (
                dudiAktif.map((dudi) => (
                  <DudiCard 
                    key={dudi.id}
                    companyName={dudi.companyName}
                    address={dudi.address}
                    phone={dudi.phone}
                    studentCount={dudi.studentCount}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">Belum ada data DUDI aktif</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}