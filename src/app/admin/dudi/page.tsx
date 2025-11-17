"use client";

import Card from '@/components/common/Card'
import { Building2 , CircleX , CircleCheckBig , Users , Phone , MapPin , Mail  } from 'lucide-react'
import { getStatus, DudiData } from '@/helper/status'
import ActionButton from '@/components/common/ActionButton'
import Button from '@/components/common/Button';
import SearchInput from '@/components/common/Serach';
import { useState, useEffect } from 'react';
import { dudiService, DudiStats } from '@/app/service/dudiService';
import ModalAddDudi from './components/AddDudi';
import ModalEditDudi from './components/EditDudi';
import DeleteModal from '@/components/modal/ModalDelete';
import { Toasts } from '@/components/modal/Toast';
import Pagination from '@/components/common/pagination';

export default function Dudi () {
    const [value, setValue] = useState('');
    const [dudiList, setDudiList] = useState<DudiData[]>([]);
    const [stats, setStats] = useState<DudiStats>({
        totalDudi: 0,
        aktifDudi: 0,
        nonaktifDudi: 0,
        pendingDudi: 0,
        totalSiswaMagang: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [dudiToEdit, setDudiToEdit] = useState<DudiData | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [dudiToDelete, setDudiToDelete] = useState<DudiData | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);

    // Fetch dudi data and statistics
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch both dudi list and statistics in parallel
                const [dudiResponse, statsResponse] = await Promise.all([
                    dudiService.getDudiList(value, currentPage, itemsPerPage),
                    dudiService.getDudiStats()
                ]);

                if (dudiResponse.success) {
                    setDudiList(dudiResponse.data);
                    if (dudiResponse.pagination) {
                        setTotalPages(dudiResponse.pagination.totalPages);
                        setTotalItems(dudiResponse.pagination.totalItems);
                    }
                } else {
                    setError(dudiResponse.error || 'Failed to fetch dudi list');
                }

                if (statsResponse.success) {
                    setStats(statsResponse.data);
                } else {
                    setError(statsResponse.error || 'Failed to fetch statistics');
                }
            } catch (err) {
                setError('An error occurred while fetching data');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [value, currentPage, itemsPerPage]);

    // Handle search
    const handleSearch = (searchValue: string) => {
        setValue(searchValue);
        setCurrentPage(1); // Reset to first page when searching
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Handle delete dudi - show confirmation modal
    const handleDeleteClick = (dudi: DudiData) => {
        setDudiToDelete(dudi);
        setIsDeleteModalOpen(true);
    };

    // Handle confirm delete
    const handleConfirmDelete = async () => {
        if (!dudiToDelete) return;

        setIsDeleting(true);
        try {
            const response = await dudiService.deleteDudi(dudiToDelete.id);
            if (response.success) {
                // Refresh the data
                const [dudiResponse, statsResponse] = await Promise.all([
                    dudiService.getDudiList(value, currentPage, itemsPerPage),
                    dudiService.getDudiStats()
                ]);

                if (dudiResponse.success) {
                    setDudiList(dudiResponse.data);
                    if (dudiResponse.pagination) {
                        setTotalPages(dudiResponse.pagination.totalPages);
                        setTotalItems(dudiResponse.pagination.totalItems);
                    }
                }
                if (statsResponse.success) {
                    setStats(statsResponse.data);
                }
                
                // Show success toast
                Toasts(
                    'success',
                    3000,
                    'Berhasil!',
                    `Perusahaan "${dudiToDelete.namaPerusahaan}" berhasil dihapus`
                );
                
                setIsDeleteModalOpen(false);
                setDudiToDelete(null);
            } else {
                const errorMsg = response.error || 'Failed to delete dudi';
                setError(errorMsg);
                // Show error toast
                Toasts(
                    'danger',
                    4000,
                    'Gagal Menghapus!',
                    errorMsg
                );
            }
        } catch (err) {
            const errorMsg = 'An error occurred while deleting dudi';
            setError(errorMsg);
            console.error('Error deleting dudi:', err);
            // Show error toast
            Toasts(
                'danger',
                4000,
                'Gagal Menghapus!',
                errorMsg
            );
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle cancel delete
    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setDudiToDelete(null);
    };

    // Handle edit dudi - show edit modal
    const handleEditClick = (dudi: DudiData) => {
        setDudiToEdit(dudi);
        setIsEditModalOpen(true);
    };

    // Handle update dudi
    const handleUpdateDudi = async (data: {
        namaPerusahaan: string;
        alamat: string;
        telepon: string;
        email: string;
        penanggungJawab: string;
        bidangUsaha: string;
        deskripsi: string;
        kuotaMagang: number;
        status: string;
        guruPenanggungJawabId: number | null;
    }) => {
        if (!dudiToEdit) return;

        try {
            const response = await dudiService.updateDudi({
                id: dudiToEdit.id,
                namaPerusahaan: data.namaPerusahaan,
                alamat: data.alamat,
                telepon: data.telepon,
                email: data.email,
                penanggungJawab: data.penanggungJawab,
                bidangUsaha: data.bidangUsaha,
                deskripsi: data.deskripsi,
                kuotaMagang: data.kuotaMagang,
                status: data.status as 'aktif' | 'nonaktif' | 'pending',
                guruPenanggungJawabId: data.guruPenanggungJawabId
            });

            if (response.success) {
                // Refresh the data
                const [dudiResponse, statsResponse] = await Promise.all([
                    dudiService.getDudiList(value, currentPage, itemsPerPage),
                    dudiService.getDudiStats()
                ]);

                if (dudiResponse.success) {
                    setDudiList(dudiResponse.data);
                    if (dudiResponse.pagination) {
                        setTotalPages(dudiResponse.pagination.totalPages);
                        setTotalItems(dudiResponse.pagination.totalItems);
                    }
                }
                if (statsResponse.success) {
                    setStats(statsResponse.data);
                }
                
                // Show success toast
                Toasts(
                    'success',
                    3000,
                    'Berhasil!',
                    `Perusahaan "${data.namaPerusahaan}" berhasil diperbarui`
                );
                
                setIsEditModalOpen(false);
                setDudiToEdit(null);
            } else {
                const errorMsg = response.error || 'Failed to update dudi';
                // Show error toast
                Toasts(
                    'danger',
                    4000,
                    'Gagal Memperbarui!',
                    errorMsg
                );
                // Throw error to be caught by child component
                throw new Error(errorMsg);
            }
        } catch (err) {
            // Show error toast for unexpected errors
            if (err instanceof Error && !err.message.includes('Failed to update dudi')) {
                Toasts(
                    'danger',
                    4000,
                    'Gagal Memperbarui!',
                    'Terjadi kesalahan saat memperbarui data'
                );
            }
            // Re-throw error so child component can handle it
            throw err;
        }
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setIsEditModalOpen(false);
        setDudiToEdit(null);
    };

    // Handle add dudi
    const handleAddDudi = async (data: {
        namaPerusahaan: string;
        alamat: string;
        telepon: string;
        email: string;
        penanggungJawab: string;
        bidangUsaha: string;
        deskripsi: string;
        kuotaMagang: number;
        status: string;
        guruPenanggungJawabId: number | null;
    }) => {
        try {
            const response = await dudiService.createDudi({
                namaPerusahaan: data.namaPerusahaan,
                alamat: data.alamat,
                telepon: data.telepon,
                email: data.email,
                penanggungJawab: data.penanggungJawab,
                bidangUsaha: data.bidangUsaha,
                deskripsi: data.deskripsi,
                kuotaMagang: data.kuotaMagang,
                status: data.status as 'aktif' | 'nonaktif' | 'pending',
                guruPenanggungJawabId: data.guruPenanggungJawabId
            });

            if (response.success) {
                // Refresh the data
                const [dudiResponse, statsResponse] = await Promise.all([
                    dudiService.getDudiList(value, currentPage, itemsPerPage),
                    dudiService.getDudiStats()
                ]);

                if (dudiResponse.success) {
                    setDudiList(dudiResponse.data);
                    if (dudiResponse.pagination) {
                        setTotalPages(dudiResponse.pagination.totalPages);
                        setTotalItems(dudiResponse.pagination.totalItems);
                    }
                }
                if (statsResponse.success) {
                    setStats(statsResponse.data);
                }
                
                // Show success toast
                Toasts(
                    'success',
                    3000,
                    'Berhasil!',
                    `Perusahaan "${data.namaPerusahaan}" berhasil ditambahkan`
                );
                
                setIsModalOpen(false);
            } else {
                const errorMsg = response.error || 'Failed to add dudi';
                // Show error toast
                Toasts(
                    'danger',
                    4000,
                    'Gagal Menambahkan!',
                    errorMsg
                );
                // Throw error to be caught by child component
                throw new Error(errorMsg);
            }
        } catch (err) {
            // Show error toast for unexpected errors
            if (err instanceof Error && !err.message.includes('Failed to add dudi')) {
                Toasts(
                    'danger',
                    4000,
                    'Gagal Menambahkan!',
                    'Terjadi kesalahan saat menambahkan data'
                );
            }
            // Re-throw error so child component can handle it
            throw err;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500 text-lg">Error: {error}</div>
            </div>
        );
    }

    return (
        <>
        <div className="bg-gray-50 p-6 min-h-screen">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                    <Card 
                        title="Total Dudi"
                        total={stats.totalDudi}
                        icon={<Building2 className='text-cyan-500'/>}
                        subtitle="Seluruh Perusahaan Mitra"
                    />
                    <Card 
                        title="Dudi Aktif"
                        total={stats.aktifDudi}
                        icon={<CircleCheckBig  className='text-lime-500'/>}
                        subtitle="Perusahaan Aktif"
                    />
                    <Card 
                        title="Dudi Tidak Aktif"
                        total={stats.nonaktifDudi}
                        icon={<CircleX className='text-[#970747]'/>}
                        subtitle="Perusahaan Tidak Aktif"
                    />
                    <Card 
                        title="Total Siswa Magang"
                        total={stats.totalSiswaMagang}
                        icon={<Users className='text-cyan-500'/>}
                        subtitle="Siswa Magang Aktif"
                    />
                </div>
        <div className='w-full h-auto rounded-lg shadow-lg bg-white p-6'>
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-2'>
                    <Building2 className='text-cyan-500' size={24} />
                    <h2 className='text-xl font-semibold'>Daftar DUDI</h2>
                </div>
                <Button 
                        variant="custom"
                        className="text-cyan-500"
                        customColor={{
                            bg: 'bg-gradient-to-r from-cyan-400 to-sky-700',
                            hover: 'hover:bg-cyan-600',
                            text: 'text-white'
                        }}
                        icon="Plus"
                        size="md"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Tambah DUDI
                    </Button>
            </div>

            <SearchInput 
                            value={value}
                            onChange={handleSearch}
                            placeholder="Cari Dudi..."
                            size="md"
                            className="w-100"
                        />

            <div className='overflow-x-auto'>
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='text-left py-3 px-4 font-medium text-gray-600'>Perusahaan</th>
                            <th className='text-left py-3 px-4 font-medium text-gray-600'>Kontak</th>
                            <th className='text-left py-3 px-4 font-medium text-gray-600'>Penanggung Jawab</th>
                            <th className='text-left py-3 px-4 font-medium text-gray-600 w-35'>Status</th>
                            <th className='text-left py-3 px-4 font-medium text-gray-600'>Siswa Magang</th>
                            <th className='text-left py-3 px-4 font-medium text-gray-600'>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dudiList.length === 0 ? (
                            <tr>
                                <td colSpan={6} className='py-8 px-4 text-center text-gray-500'>
                                    Tidak ada data dudi ditemukan
                                </td>
                            </tr>
                        ) : (
                            dudiList.map((dudi) => {
                                const statusInfo = getStatus(dudi.status);
                                return (
                                    <tr key={dudi.id} className='hover:bg-gray-50'>
                                        <td className='py-4 px-4'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-10 h-10 bg-cyan-500 rounded flex items-center justify-center text-white font-bold'>
                                                    <Building2 />
                                                </div>
                                                <div>
                                                    <div className='font-medium'>{dudi.namaPerusahaan}</div>
                                                    <div className='text-sm text-gray-500 flex items-center gap-1'>
                                                        <MapPin size={15}/>
                                                        {dudi.alamat}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='py-4 px-4'>
                                            <div className='text-sm text-gray-600'>
                                                <div className='flex items-center gap-1'>
                                                    <Mail size={15} />
                                                    {dudi.email}</div>
                                                <div className='flex items-center gap-1'>
                                                    <Phone size={15}/> 
                                                    {dudi.telepon}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='py-4 px-4'>
                                            <div className='flex items-center gap-2'>
                                                <div className='flex items-center justify-center w-8 h-8 rounded-full bg-gray-200'>
                                                    <Users size={16} className='text-gray-400' />
                                                </div>
                                                <span>{dudi.penanggungJawab}</span>
                                            </div>
                                        </td>
                                        <td className='py-4 px-4'>
                                            <span className={`${statusInfo.bgColor} ${statusInfo.textColor} px-3 py-1 rounded-full text-sm font-medium`}>
                                                {statusInfo.label}
                                            </span>
                                        </td>
                                        <td className='py-4 px-4'>
                                            <span className='bg-cyan-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-medium'>
                                                {dudi.jumlahSiswaMagang}
                                            </span>
                                        </td>
                                        <td className='py-4 px-4'>
                                            <div className='flex gap-2'>
                                                <ActionButton 
                                                color="warning" 
                                                icon="Pencil"
                                                tooltip="Edit"
                                                onClick={() => handleEditClick(dudi)}
                                                />

                                                <ActionButton 
                                                color="danger" 
                                                icon="Trash2"
                                                tooltip="Delete"
                                                onClick={() => handleDeleteClick(dudi)}
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

        {/* Modal Add Dudi */}
        <ModalAddDudi
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddDudi}
        />

        {/* Modal Edit Dudi */}
        <ModalEditDudi
            isOpen={isEditModalOpen}
            onClose={handleCancelEdit}
            onSubmit={handleUpdateDudi}
            dudiData={dudiToEdit ? {
                namaPerusahaan: dudiToEdit.namaPerusahaan,
                alamat: dudiToEdit.alamat,
                telepon: dudiToEdit.telepon,
                email: dudiToEdit.email,
                penanggungJawab: dudiToEdit.penanggungJawab,
                bidangUsaha: dudiToEdit.bidangUsaha || '',
                deskripsi: dudiToEdit.deskripsi || '',
                kuotaMagang: dudiToEdit.kuotaMagang || 0,
                status: dudiToEdit.status,
                guruPenanggungJawabId: dudiToEdit.guruPenanggungJawabId
            } : null}
        />

        {/* Modal Delete Dudi */}
        <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            title="Hapus Data DUDI?"
            description="Data yang dihapus tidak dapat dikembalikan. Apakah Anda yakin ingin menghapus perusahaan ini?"
            userName={dudiToDelete?.namaPerusahaan}
            isLoading={isDeleting}
        />
        </div>
        </>
    )
}