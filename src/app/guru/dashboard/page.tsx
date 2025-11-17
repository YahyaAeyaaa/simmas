'use client';

import { Users, LayoutDashboard, GraduationCap, Building2, BookOpen  } from 'lucide-react';
import HeaderCard from '@/components/common/headerCard';
import Card from '@/components/common/Card'
import LogbookCard from '@/components/common/LogBookCard';
import DudiCard from '@/components/common/DudiCard';
import MagangCard from '@/components/common/MagangCard';
import { guruService, DashboardStats, MagangTerbaru, DudiAktif, LogbookTerbaru } from '@/app/service/guruApiService';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSiswa: 0,
    totalDudi: 0,
    magangAktif: 0,
    logbookPending: 0
  });
  const [magangTerbaru, setMagangTerbaru] = useState<MagangTerbaru[]>([]);
  const [dudiAktif, setDudiAktif] = useState<DudiAktif[]>([]);
  const [logbookTerbaru, setLogbookTerbaru] = useState<LogbookTerbaru[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all dashboard data in parallel
        const [statsResponse, magangResponse, dudiResponse, logbookResponse] = await Promise.all([
          guruService.getDashboardStats(),
          guruService.getMagangTerbaru(),
          guruService.getDudiAktif(),
          guruService.getLogbookTerbaru()
        ]);

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }

        if (magangResponse.success) {
          setMagangTerbaru(magangResponse.data);
        }

        if (dudiResponse.success) {
          setDudiAktif(dudiResponse.data);
        }

        if (logbookResponse.success) {
          setLogbookTerbaru(logbookResponse.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#970747] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className='bg-gray-50 p-6 min-h-screen'>
      <HeaderCard 
        title="Dashboard Guru"
        subtitle="Selamat datang kembali!"
        icon={<LayoutDashboard className="w-8 h-8 text-white" />}
        variant='gradient'
      />
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
            title="Total Siswa"
            total={stats.totalSiswa}
            icon={<Users className='text-cyan-500'/>}
            subtitle="Siswa Bimbingan"
        />
        <Card 
            title="Total Dudi"
            total={stats.totalDudi}
            icon={<Building2 className='text-cyan-500'/>}
            subtitle="Perusahaan Partner"
        />
        <Card 
            title="Magang Aktif"
            total={stats.magangAktif}
            icon={<GraduationCap className='text-cyan-500'/>}
            subtitle="Sedang Magang"
        />
        <Card 
            title="Logbook Pending"
            total={stats.logbookPending}
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
              <GraduationCap className='text-cyan-500'/>
              <p className='font-semibold text-sm'>Magang Terbaru</p>
            </div>
            
            {magangTerbaru.length > 0 ? (
              magangTerbaru.slice(0, 3).map((magang) => (
                <MagangCard 
                  key={magang.id}
                  studentName={magang.studentName}
                  companyName={magang.companyName}
                  startDate={magang.startDate} 
                  endDate={magang.endDate}
                  status={magang.status}
                />
              ))
            ) : (
              <p className="text-gray-500 text-sm">Tidak ada data magang</p>
            )}
          </div>

          {/* Dudi Aktif Card */}
              <div className='bg-white rounded-lg shadow-lg p-6'>
              <div className='flex items-center gap-3 mb-4'>
                <Building2 className='text-orange-500'/>
                <p className='font-semibold text-sm'>Dudi Aktif</p>
              </div>
              <hr className='bg-slate-200 text-gray-400'/>
              
              {dudiAktif.length > 0 ? (
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
                <p className="text-gray-500 text-sm">Tidak ada data dudi</p>
              )}
            </div>
        </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6'>
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <BookOpen className='text-lime-500'/>
              <p className='font-semibold text-sm'>Logbook Terbaru</p>
            </div>
            
            {logbookTerbaru.length > 0 ? (
              logbookTerbaru.slice(0, 3).map((logbook) => (
                <LogbookCard 
                  key={logbook.id}
                  name={logbook.name}
                  date={logbook.date}
                  issue={logbook.issue}
                  status={logbook.status}
                />
              ))
            ) : (
              <p className="text-gray-500 text-sm">Tidak ada data logbook</p>
            )}
          </div>
            </div>
            </div>
    </>
  );
}