"use client";

import React, { useState, useEffect } from 'react'
import Card from '@/components/common/Card'
import { Building2 , CircleX , CircleCheckBig , Users , Phone , MapPin , Mail , Building, Trash2, Pencil, Eye  } from 'lucide-react'
import Button from '@/components/common/Button';
import SearchInput from '@/components/common/Serach';
import Pagination from '@/components/common/pagination';
import { guruDudiService, GuruDudiData, GuruDudiStats } from '@/app/service/guruDudiApiService';
import { Toasts } from '@/components/modal/Toast';

export default function Dudi () {
    const [searchValue, setSearchValue] = useState('');
    const [dudiList, setDudiList] = useState<GuruDudiData[]>([]);
    const [stats, setStats] = useState<GuruDudiStats>({
        totalDudiMitra: 0,
        totalSiswaMagang: 0,
        rataRataSiswaPerusahaan: 0,
        statusStats: {
            pending: 0,
            berlangsung: 0,
            selesai: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // State untuk pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);

    // Fetch data saat component mount
    useEffect(() => {
        fetchData();
    }, [currentPage]);

    // Fetch data dengan debounce untuk search
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1); // Reset to first page when searching
            fetchData();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchValue]);

    // Fetch data DUDI dan statistik
    const fetchData = async () => {
        setLoading(true);
        setError('');
        
        try {
            // Fetch DUDI list dan stats secara parallel
            const [dudiResponse, statsResponse] = await Promise.all([
                guruDudiService.getGuruDudiList(searchValue, currentPage, itemsPerPage),
                guruDudiService.getGuruDudiStats()
            ]);

            if (dudiResponse.success) {
                setDudiList(dudiResponse.data);
                if (dudiResponse.pagination) {
                    setTotalPages(dudiResponse.pagination.totalPages);
                    setTotalItems(dudiResponse.pagination.totalItems);
                }
            } else {
                setError(dudiResponse.error || 'Gagal memuat data DUDI');
            }

            if (statsResponse.success) {
                setStats(statsResponse.data);
            } else {
                console.error('Failed to fetch stats:', statsResponse.error);
            }

        } catch (err) {
            setError('Terjadi kesalahan saat memuat data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Format tanggal untuk display
    const formatDisplayDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Get status color
    const getStatusColor = (status: string) => {
        const statusMap: { [key: string]: { bgColor: string; textColor: string; dotColor: string } } = {
            'aktif': {
                bgColor: 'bg-green-100',
                textColor: 'text-green-700',
                dotColor: 'bg-green-500'
            },
            'nonaktif': {
                bgColor: 'bg-red-100',
                textColor: 'text-red-700',
                dotColor: 'bg-red-500'
            },
            'pending': {
                bgColor: 'bg-orange-100',
                textColor: 'text-orange-700',
                dotColor: 'bg-orange-500'
            }
        };
        return statusMap[status] || statusMap['pending'];
    };
    return (
        <>
        <div className='bg-gray-50 p-6 min-h-screen'>
            <p className="text-2xl font-semibold font-family-plus-jakarta mb-6">Manajemen DUDI</p>
            
            <div className='my-4'>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card 
                        title="Total DUDI Mitra"
                        total={stats.totalDudiMitra}
                        icon={<Building2 className='text-cyan-500'/>}
                        subtitle="Perusahaan mitra aktif"
                    />
                    <Card 
                        title="Total Siswa Magang"
                        total={stats.totalSiswaMagang}
                        icon={<Users className='text-cyan-500'/>}
                        subtitle="Siswa bimbingan"
                    />
                    <Card 
                        title="Rata-rata Siswa"
                        total={stats.rataRataSiswaPerusahaan}
                        icon={<Building className='text-cyan-500'/>}
                        subtitle="Per perusahaan"
                    />
                </div>
            </div>
         <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
            <Building2 className="text-cyan-600" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Daftar DUDI</h2>
        </div>
      </div>

      {/* Search Section */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-start items-center bg-gray-50 gap-3">
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
          placeholder="Cari perusahaan..."
          size="md"
          className="w-full max-w-md"
          showClearButton={true}
        />
        <Button 
          variant="custom" 
          customColor={{ 
            bg: 'bg-white', 
            hover: 'hover:bg-cyan-600 hover:text-white', 
            text: 'text-cyan-500' 
          }}
          icon="Sparkles"
          size="md"
        >
          Filter
        </Button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
            >
              Coba Lagi
            </button>
          </div>
        ) : dudiList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Tidak ada data DUDI untuk siswa bimbingan Anda</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Perusahaan</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Kontak</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Penanggungjawab</th>
                <th className="text-center py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Siswa Bimbingan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dudiList.map((dudi) => {
                const statusInfo = getStatusColor(dudi.status);
                
                return (
                  <tr key={dudi.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                          <Building2 className="text-white" size={20} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{dudi.namaPerusahaan}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin size={12} />
                            {dudi.alamat}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-700 flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          {dudi.email}
                        </div>
                        <div className="text-sm text-gray-700 flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />
                          {dudi.telepon}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                          {dudi.penanggungJawab.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{dudi.penanggungJawab}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-center">
                          <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-bold min-w-[40px] text-center">
                            {dudi.jumlahSiswaMagang}
                          </span>
                        </div>
                        {dudi.siswaBimbingan.length > 0 && (
                          <div className="text-xs text-gray-500 text-center">
                            {dudi.siswaBimbingan.slice(0 , 0).map(siswa => siswa.nama).join(', ')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && dudiList.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      )}
            </div>
        </div>
        </>
    )
}