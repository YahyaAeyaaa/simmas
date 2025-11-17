"use client";

import Card from '@/components/common/Card'
import { Building2 , Clock , ThumbsUp  , ThumbsDown  , Eye , BookOpen } from 'lucide-react'
import { getLogbookStatus } from '@/helper/LogBookHelper';
import SearchInput from '@/components/common/Serach';
import { useState, useEffect } from 'react';
import DetailJurnalModal from './components/DetailJurnalModal';
import { logbookService, LogbookData } from '@/app/service/logbookService';
import { Toasts } from '@/components/modal/Toast';

export default function Jurnal () {
    const [searchValue, setSearchValue] = useState('');
    const [selectedJurnal, setSelectedJurnal] = useState<LogbookData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jurnalList, setJurnalList] = useState<LogbookData[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalLogbook: 0,
        pendingLogbook: 0,
        approvedLogbook: 0,
        rejectedLogbook: 0
    });

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, [searchValue]);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch logbook list
            const logbookResponse = await logbookService.getLogbooks(1, 50, '', searchValue);
            if (logbookResponse.success) {
                setJurnalList(logbookResponse.data);
            }
            
            // Fetch stats
            const statsResponse = await logbookService.getLogbookStats();
            if (statsResponse.success && statsResponse.data) {
                setStats({
                    totalLogbook: statsResponse.data.totalLogbook,
                    pendingLogbook: statsResponse.data.pendingLogbook,
                    approvedLogbook: statsResponse.data.approvedLogbook,
                    rejectedLogbook: statsResponse.data.rejectedLogbook
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Toasts('danger', 4000, 'Error', 'Gagal mengambil data');
        } finally {
            setLoading(false);
        }
    };

    const handleViewJurnal = (jurnal: LogbookData) => {
        setSelectedJurnal(jurnal);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedJurnal(null);
    };

    const handleSubmitVerification = async (id: number, status: 'approved' | 'rejected', catatan: string) => {
        try {
            // Call API to update logbook
            const response = await logbookService.updateLogbook(id, {
                statusVerifikasi: status,
                catatanGuru: catatan
            });

            if (response.success) {
                // Update local state
                setJurnalList(prevList => 
                    prevList.map(jurnal => 
                        jurnal.id === id 
                            ? { ...jurnal, statusVerifikasi: status, catatanGuru: catatan }
                            : jurnal
                    )
                );
                
                // Refresh stats
                await fetchData();
                
                // Show success message
                Toasts('success', 3000, 'Berhasil!', `Jurnal berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}`);
            } else {
                Toasts('danger', 4000, 'Gagal!', 'Gagal mengupdate jurnal');
            }
        } catch (error) {
            console.error('Error updating logbook:', error);
            Toasts('danger', 4000, 'Error', 'Gagal mengupdate jurnal');
        }
    };

    return (
        <>
        <div className='bg-gray-50 p-6 min-h-screen'>
            <div className="my-6 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
            title="Total logbook"
            total={loading ? 0 : stats.totalLogbook}
            icon={<BookOpen className='text-cyan-500'/>}
            subtitle="Laporan Harian Terdaftar"
        />
        <Card 
            title="Belum diverifikasi"
            total={loading ? 0 : stats.pendingLogbook}
            icon={<Clock   className='text-cyan-500'/>}
            subtitle="Menunggu Verifikasi"
        />
        <Card 
            title="Disetujui"
            total={loading ? 0 : stats.approvedLogbook}
            icon={<ThumbsUp className='text-cyan-500'/>}
            subtitle="Sudah diverifikasi"
        />
                <Card 
            title="Ditolak"
            total={loading ? 0 : stats.rejectedLogbook}
            icon={<ThumbsDown  className='text-cyan-500'/>}
            subtitle="Perlu diperbaiki"
        />
            </div>
        </div>
        <div className='w-full h-auto rounded-lg shadow-lg bg-white p-6'>
                <div className='flex items-center gap-2'>
                    <Building2 className='text-cyan-500' size={24} />
                    <h2 className='text-xl font-semibold'>Daftar DUDI</h2>
                </div>

                <SearchInput
                    value={searchValue}
                    onChange={setSearchValue}
                    placeholder="Cari siswa, NIS, atau DUDI..."
                    size="md"
                    className="w-full max-w-md my-4"
                    showClearButton={true}
                />

            <div className='overflow-x-auto'>
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='text-left py-3 px-4 font-medium text-gray-600'>Siswa & Tanggal</th>
                            <th className='text-left py-3 px-4 font-medium text-gray-600 w-100'>Kegiatan & Kendala</th>
                            <th className='text-left py-3 px-4 font-medium text-gray-600'>Status</th>
                            <th className='text-left py-3 px-4 font-medium text-gray-600'>Catatan Guru</th>
                            <th className='text-left py-3 px-4 font-medium text-gray-600'>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center">
                                    <div className="flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="ml-2 text-gray-600">Memuat data...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : jurnalList.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center">
                                    <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                                    <p className="text-gray-500">Belum ada jurnal harian</p>
                                </td>
                            </tr>
                        ) : (
                            jurnalList.map((jurnal) => {
                                const statusInfo = getLogbookStatus(jurnal.statusVerifikasi);
                                return (
                                    <tr key={jurnal.id} className='hover:bg-gray-50'>
                                        <td className='py-4 px-4'>
                                                    <div className='font-medium'>{jurnal.magang.siswa.nama}</div>
                                                    <div className='text-sm text-gray-500'>
                                                        <p>{jurnal.magang.siswa.nis}</p>
                                                        <p>{new Date(jurnal.tanggal).toLocaleDateString('id-ID')}</p>
                                                    </div>
                                        </td>
                                        <td className='py-4 px-4'>
                                            <div className='text-sm text-gray-600 max-w-xs'>
                                                <p className='font-semibold'>Kegiatan :</p>
                                                <p className="truncate" title={jurnal.kegiatan}>{jurnal.kegiatan}</p>
                                                <p className='font-semibold mt-2'>Kendala :</p>
                                                <p className="truncate" title={jurnal.kendala || 'Tidak ada kendala'}>{jurnal.kendala || 'Tidak ada kendala'}</p>
                                            </div>
                                        </td>
                                        <td className='py-4 px-4'>
                                            <div className='flex items-center gap-2'>
                                                <span className={`${statusInfo.bgColor} ${statusInfo.textColor} px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
                                                    {statusInfo.IconComponent && <statusInfo.IconComponent size={16} />}
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                        </td>
                                            <td className='py-4 px-4'>
                                            <div className='text-sm text-gray-600 max-w-xs'>
                                                {jurnal.catatanGuru || '-'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className='flex justify-center gap-2 text-gray-600'>
                                                <Eye 
                                                    onClick={() => handleViewJurnal(jurnal)}
                                                    className='hover:text-cyan-500 transition-all duration-150 cursor-pointer' 
                                                />
                                            </div>
                                        </td>
                                        
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Modal Detail Jurnal */}
        <DetailJurnalModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            jurnal={selectedJurnal}
            onSubmit={handleSubmitVerification}
        />
    </div>
        </>
    )
}