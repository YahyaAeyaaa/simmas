import { Users, LayoutDashboard, GraduationCap, Building2, BookOpen  } from 'lucide-react';
import HeaderCard from '@/components/common/headerCard';
import Card from '@/components/common/Card'
import LogbookCard from '@/components/common/LogBookCard';
import DudiCard from '@/components/common/DudiCard';
import MagangCard from '@/components/common/MagangCard';

export default function Dashboard() {
  return (
    <>
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
            total={150}  // tanpa kutip
            icon={<Users className='text-[#970747]'/>}
            subtitle="Seluruh Siswa Terdaftar"
        />
        <Card 
            title="Total Dudi"
            total={25}  // tanpa kutip
            icon={<Building2 className='text-[#970747]'/>}
            subtitle="Perusahaan Partner"
        />
        <Card 
            title="Magang Aktif"
            total={120}  // tanpa kutip
            icon={<GraduationCap className='text-[#970747]'/>}
            subtitle="Sedang Magang"
        />
        <Card 
            title="Logbook Pending"
            total={8}  // tanpa kutip
            icon={<BookOpen className='text-[#970747]'/>}
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
            
            <MagangCard 
              studentName="Ahmad Zaki"
              companyName="PT. Tecno"
              startDate="15/1/2025" 
              endDate="15/2/2025"
              status="aktif"
            />
          </div>

          {/* Dudi Aktif Card */}
              <div className='bg-white rounded-lg shadow-lg p-6'>
              <div className='flex items-center gap-3 mb-4'>
                <Building2 className='text-[#970747]'/>
                <p className='font-semibold text-sm'>Dudi Aktif</p>
              </div>
              
              <DudiCard 
                companyName="PT. Techno"
                address="Jl. Anu di anunya anu"
                phone="0813-5722-4771"
                studentCount={8}
              />
            </div>
        </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6'>
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <BookOpen className='text-[#970747]'/>
              <p className='font-semibold text-sm'>Logbook Terbaru</p>
            </div>
            
            <LogbookCard 
              name="Ahmad Zaki"
              date="15/1/2025"
              issue="Materi Susah banget cog"
              status="pending"
            />
            
            <LogbookCard 
              name="Ahmad Zaki"
              date="15/1/2025"
              issue="Materi Susah banget cog"
              status="active"
            />
            
            <LogbookCard 
              name="Ahmad Zaki"
              date="15/1/2025"
              issue="Materi Susah banget cog"
              status="rejected"
            />
          </div>
            </div>

    </>
  );
}