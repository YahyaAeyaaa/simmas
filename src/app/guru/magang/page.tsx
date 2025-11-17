"use client";

import React, { useState, useEffect } from 'react'
import Card from '@/components/common/Card'
import { CircleCheckBig, GraduationCap, Users, Calendar } from 'lucide-react'
import ActionButton from '@/components/common/ActionButton'
import Button from '@/components/common/Button'
import SearchInput from '@/components/common/Serach'
import ModalTambahMagang from './components/AddMagangiSiswa'
import ModalEditMagang from './components/EditMagangSiswa'
import { magangService, MagangData } from '@/app/service/magangApiService'
import { Toasts } from '@/components/modal/Toast';
import Pagination from '@/components/common/pagination';

export default function Pengguna() {
    const [searchValue, setSearchValue] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMagang, setSelectedMagang] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // State untuk data dari API
    const [magangList, setMagangList] = useState<MagangData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // State untuk pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);
    
    // State untuk polling
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    // Fetch data saat component mount
    useEffect(() => {
        fetchMagangData();
    }, [currentPage]);

    // Fetch data magang
    const fetchMagangData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await magangService.getMagangList(searchValue, '', currentPage, itemsPerPage);
            if (response.success) {
                setMagangList(response.data);
                if (response.pagination) {
                    setTotalPages(response.pagination.totalPages);
                    setTotalItems(response.pagination.totalItems);
                }
            } else {
                setError(response.error || 'Gagal memuat data');
            }
        } catch (err) {
            setError('Terjadi kesalahan saat memuat data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Polling background untuk update realtime tanpa loading
    useEffect(() => {
        const interval = setInterval(() => {
            // Background refresh tanpa set loading
            const backgroundRefresh = async () => {
                try {
                    const response = await magangService.getMagangList(searchValue, '', currentPage, itemsPerPage);
                    if (response.success) {
                        // Cek apakah ada perubahan data
                        const currentIds = magangList.map(m => m.id).sort().join(',');
                        const newIds = response.data.map(m => m.id).sort().join(',');
                        
                        // Hanya update state jika ada perubahan
                        if (currentIds !== newIds) {
                            setMagangList(response.data);
                            if (response.pagination) {
                                setTotalPages(response.pagination.totalPages);
                                setTotalItems(response.pagination.totalItems);
                            }
                            setLastUpdate(new Date());
                        }
                    }
                } catch (err) {
                    console.log('Background refresh failed:', err);
                }
            };
            
            backgroundRefresh();
        }, 15000); // 15s polling (lebih jarang)
        return () => clearInterval(interval);
    }, [currentPage, searchValue, magangList]);

    // Search dengan debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1); // Reset to first page when searching
            fetchMagangData();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchValue]);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Hitung statistik dari data real
    const stats = {
        totalSiswa: totalItems, 
        totalDudi: new Set(magangList.map(m => m.dudiId)).size,
        magangAktif: magangList.filter(m => m.status === 'berlangsung').length,
        logbookPending: 0 // TODO: Implementasi nanti dari logbook
    };

    const getStatus = (status: string) => {
        const statusMap: {
            [key: string]: {
                label: string;
                bgColor: string;
                textColor: string;
                dotColor: string;
            }
        } = {
            'berlangsung': {
                label: 'Aktif',
                bgColor: 'bg-green-100',
                textColor: 'text-green-700',
                dotColor: 'bg-green-500'
            },
            'selesai': {
                label: 'Selesai',
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-700',
                dotColor: 'bg-blue-500'
            },
            'pending': {
                label: 'Pending',
                bgColor: 'bg-orange-100',
                textColor: 'text-orange-700',
                dotColor: 'bg-orange-500'
            }
        };
        return statusMap[status] || statusMap['pending'];
    };

    const getNilaiColor = (nilai: string | number | null): string => {
        if (!nilai || nilai === "0" || nilai === 0) {
            return 'bg-gray-300 text-gray-600';
        }
        return 'bg-cyan-500 text-white';
    };

    const handleSubmitMagang = async (data: any) => {
        console.log('Data magang berhasil ditambahkan:', data);
        
        // Refresh data setelah tambah
        await fetchMagangData();
        
        // TODO: Toast Error nanti perbaiki
        // alert('Data magang berhasil ditambahkan!');
        Toasts('success', 4000, 'Magang Berhasil Dibuat!', `Magang ${data.namaPerusahaan} telah berhasil ditambahkan`)
        
        setIsModalOpen(false);
    };

    const handleEdit = (magang: MagangData) => {
        setSelectedMagang({
            id: magang.id,
            tanggalMulai: magang.tanggalMulai.split('T')[0], // Format YYYY-MM-DD
            tanggalSelesai: magang.tanggalSelesai.split('T')[0],
            status: magang.status,
            nilaiAkhir: magang.nilaiAkhir?.toString() || ''
        });
        setIsEditModalOpen(true);
    };

    const handleSubmitEdit = async (data: any) => {
        if (!selectedMagang?.id) {
            alert('ID magang tidak valid');
            return;
        }

        try {
            const response = await magangService.updateMagang(selectedMagang.id, {
                tanggalMulai: data.tanggalMulai,
                tanggalSelesai: data.tanggalSelesai,
                status: data.status,
                nilaiAkhir: data.nilaiAkhir || null
            });

            if (response.success) {
                // Refresh data
                await fetchMagangData();
                
                Toasts('success', 4000, 'Data Berhasil Diperbarui!', `Data magang telah berhasil diperbarui`);
                setIsEditModalOpen(false);
            } else {
                Toasts('danger', 4000, 'Gagal Memperbarui Data!', response.error || 'Terjadi kesalahan saat memperbarui data');
            }
        } catch (error) {
            console.error('Error updating magang:', error);
            Toasts('danger', 4000, 'Gagal Memperbarui Data!', 'Terjadi kesalahan saat memperbarui data');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data magang ini?')) {
            return;
        }

        try {
            const response = await magangService.deleteMagang(id);
            
            if (response.success) {
                // Refresh data
                await fetchMagangData();
                
                Toasts('success', 4000, 'Data Berhasil Dihapus!', 'Data magang telah berhasil dihapus');
            } else {
                Toasts('danger', 4000, 'Gagal Menghapus Data!', response.error || 'Terjadi kesalahan saat menghapus data');
            }
        } catch (error) {
            console.error('Error deleting magang:', error);
            Toasts('danger', 4000, 'Gagal Menghapus Data!', 'Terjadi kesalahan saat menghapus data');
        }
    };

    // Format tanggal untuk display
    const formatDisplayDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <>
            <div className='bg-gray-50 p-6 min-h-screen'>
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-semibold font-family-plus-jakarta mb-2">Manajemen Siswa Magang</p>
                        </div>
                    </div>
                </div>
                
                <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card 
                            title="Total Siswa"
                            total={stats.totalSiswa}
                            icon={<Users className='text-cyan-500'/>}
                            subtitle="Seluruh Siswa Magang"
                        />
                        <Card 
                            title="Total Dudi"
                            total={stats.totalDudi}
                            icon={<GraduationCap className='text-cyan-500'/>}
                            subtitle="Perusahaan Partner"
                        />
                        <Card 
                            title="Magang Aktif"
                            total={stats.magangAktif}
                            icon={<CircleCheckBig className='text-cyan-500'/>}
                            subtitle="Sedang Magang"
                        />
                        <Card 
                            title="Logbook Pending"
                            total={stats.logbookPending}
                            icon={<Calendar className='text-cyan-500'/>}
                            subtitle="Menunggu Verifikasi"
                        />
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Daftar Siswa Magang</h2>
                        </div>
                        <Button 
                            variant="custom" 
                            customColor={{ 
                                bg: 'bg-gradient-to-r from-cyan-500 to-sky-600', 
                                hover: 'hover:bg-cyan-600', 
                                text: 'text-white' 
                            }}
                            icon="Plus"
                            size="md"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Tambah
                        </Button>
                    </div>

                    <div className="px-6 py-4 border-b border-gray-200 flex justify-start gap-3 items-center bg-gray-50">
                        <SearchInput
                            value={searchValue}
                            onChange={setSearchValue}
                            placeholder="Cari siswa, NIS, atau DUDI..."
                            size="md"
                            className="w-full max-w-md"
                            showClearButton={true}
                        />
                        <Button 
                            variant="custom" 
                            customColor={{ 
                                bg: 'bg-cyan-500', 
                                hover: 'hover:bg-white hover:text-cyan-500', 
                                text: 'text-white' 
                            }}
                            icon="Sparkles"
                            size="md"
                        >
                            Filter
                        </Button>
                    </div>

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
                                    onClick={fetchMagangData}
                                    className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                                >
                                    Coba Lagi
                                </button>
                            </div>
                        ) : magangList.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-600">Tidak ada data magang</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Siswa</th>
                                        <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">DUDI</th>
                                        <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Periode</th>
                                        <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Nilai</th>
                                        <th className="text-center py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {magangList.map((magang) => {
                                        const statusInfo = getStatus(magang.status);
                                        
                                        return (
                                            <tr key={magang.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                                                            {magang.siswa.nama.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900">{magang.siswa.nama}</div>
                                                            <div className="text-xs text-gray-500">NIS: {magang.siswa.nis}</div>
                                                            <div className="text-xs text-gray-500">{magang.siswa.kelas}</div>
                                                            <div className="text-xs text-gray-400">{magang.siswa.jurusan}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{magang.dudi.namaPerusahaan}</div>
                                                            <div className="text-xs text-gray-500">{magang.dudi.alamat}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-sm text-gray-700">{formatDisplayDate(magang.tanggalMulai)}</div>
                                                    <div className="text-xs text-gray-400">s.d {formatDisplayDate(magang.tanggalSelesai)}</div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`${statusInfo.bgColor} ${statusInfo.textColor} px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`}></span>
                                                        {statusInfo.label}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`${getNilaiColor(magang.nilaiAkhir)} px-3 py-1.5 rounded-lg text-xs font-bold inline-block  text-center`}>
                                                        {magang.nilaiAkhir || '-'} <span className='text-xs'>/ 100</span>
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex justify-center gap-2">
                                                        <ActionButton 
                                                            color="warning" 
                                                            icon="Pencil" 
                                                            onClick={() => handleEdit(magang)}
                                                            tooltip="Edit"
                                                        />
                                                        {magang.status === 'pending' && (
                                                            <>
                                                                <ActionButton 
                                                                    color="success" 
                                                                    icon="Check" 
                                                                    onClick={async () => {
                                                                        try {
                                                                            const res = await magangService.updateMagang(magang.id, {
                                                                                tanggalMulai: magang.tanggalMulai.split('T')[0],
                                                                                tanggalSelesai: magang.tanggalSelesai.split('T')[0],
                                                                                status: 'berlangsung'
                                                                            });
                                                                            if (res.success) {
                                                                                Toasts('success', 4000, 'Pengajuan diterima', `${magang.siswa.nama} mulai magang`);
                                                                                fetchMagangData();
                                                                            } else {
                                                                                Toasts('danger', 4000, 'Gagal menerima', res.error || 'Coba lagi');
                                                                            }
                                                                        } catch (e) {
                                                                            Toasts('danger', 4000, 'Error', 'Gagal memproses persetujuan');
                                                                        }
                                                                    }}
                                                                    tooltip="Terima"
                                                                />
                                                                <ActionButton 
                                                                    color="danger" 
                                                                    icon="X" 
                                                                    onClick={async () => {
                                                                        try {
                                                                            const res = await magangService.updateMagang(magang.id, {
                                                                                tanggalMulai: magang.tanggalMulai.split('T')[0],
                                                                                tanggalSelesai: magang.tanggalSelesai.split('T')[0],
                                                                                status: 'ditolak' as any
                                                                            } as any);
                                                                            if (res.success) {
                                                                                Toasts('warning', 4000, 'Pengajuan ditolak', `${magang.siswa.nama} ditolak`);
                                                                                fetchMagangData();
                                                                            } else {
                                                                                Toasts('danger', 4000, 'Gagal menolak', res.error || 'Coba lagi');
                                                                            }
                                                                        } catch (e) {
                                                                            Toasts('danger', 4000, 'Error', 'Gagal memproses penolakan');
                                                                        }
                                                                    }}
                                                                    tooltip="Tolak"
                                                                />
                                                            </>
                                                        )}
                                                        <ActionButton 
                                                            color="danger" 
                                                            icon="Trash2" 
                                                            onClick={() => handleDelete(magang.id)}
                                                            tooltip="Delete"
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {!loading && !error && magangList.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems}
                    />
                )}
            </div>

            <ModalEditMagang
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleSubmitEdit}
                initialData={selectedMagang}
            />
            <ModalTambahMagang 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitMagang}
            />
        </>
    )
}