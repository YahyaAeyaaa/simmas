"use client";

import { useState, useEffect } from "react";
import SearchInput from "@/components/common/Serach";
import MagangCard from "./components/card";
import ModalDetailTempatMagang from "./components/modalDetail";
import { siswaDudiService, SiswaDudiData } from "@/app/service/siswaDudiService";
import Pagination from "@/components/common/pagination";
import Button from "@/components/common/Button";
import { Toasts } from "@/components/modal/Toast";


export default function CariTempatMagang() {
    // Di bagian state (sekitar baris 15-20)
    const [searchError, setSearchError] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState('8');
    const [dudiList, setDudiList] = useState<SiswaDudiData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDudi, setSelectedDudi] = useState<SiswaDudiData | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const validateSearch = (value: string) => {
        if (value.trim().length < 2) {
            setSearchError('Minimal 2 karakter untuk pencarian');
            return false;
        }
        setSearchError(null);
        return true;
    };

    // Fetch dudi data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await siswaDudiService.getDudiList(searchValue);
                
                if (searchValue && !validateSearch(searchValue)) {
                    return;
                }
                if (response.success) {
                    setDudiList(response.data);
                } else {
                    setError(response.error || 'Failed to fetch dudi list');
                }
            } catch (err) {
                setError('An error occurred while fetching data');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchValue]);

    const handleDetail = async (id: number) => {
        try {
            const response = await siswaDudiService.getDudiById(id);
            if (response.success) {
                setSelectedDudi(response.data);
                setIsModalOpen(true);
            } else {
                console.error('Error fetching dudi detail:', response.error);
            }
        } catch (err) {
            console.error('Error fetching dudi detail:', err);
        }
    };

    const handleDaftar = async (id: number) => {
        try {
            const response = await siswaDudiService.daftarMagang(id);
            if (response.success) {
                Toasts('success', 4000, 'Pendaftaran berhasil', 'Menunggu persetujuan guru');
                // Refresh list agar status/CTA bisa berubah kalau backend menandai "sudahDaftar"
                const refreshed = await siswaDudiService.getDudiList(searchValue);
                if (refreshed.success) setDudiList(refreshed.data);
            } else {
                Toasts('danger', 4000, 'Gagal mendaftar', response.error || 'Coba lagi nanti');
            }
        } catch (err) {
            console.error('Error mendaftar magang:', err);
            Toasts('danger', 4000, 'Terjadi kesalahan', 'Gagal mendaftar magang');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDudi(null);
    };
    

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Cari Tempat Magang</h1>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg">Loading...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Cari Tempat Magang</h1>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-red-500 text-lg">Error: {error}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Cari Tempat Magang</h1>

                {/* Search & Filter Section */}
                <div className="p-4 mb-6">
                    <div className="flex items-center justify-start gap-4 flex-wrap">
                        <SearchInput
                            value={searchValue}
                            onChange={setSearchValue}
                            placeholder="Cari perusahaan, bidang..."
                            size="sm"
                            className="min-w-100"
                        />
                        { searchError && (
                            <p className="text-red-500 text-sm">{searchError}</p>
                        ) }
                        <Button
                            variant="custom"
                            className="border border-cyan-500 text-cyan-500"
                            customColor={{
                                bg: 'bg-white',
                                hover: 'hover:bg-cyan-600 hover:text-white',
                                text: 'text-cyan-500'
                            }}
                            icon="Sparkles"
                            size="sm"
                        >
                            Filter
                        </Button>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {dudiList.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            Tidak ada tempat magang yang tersedia
                        </div>
                    ) : (
                        dudiList.map((tempat) => (
                            <MagangCard
                                key={tempat.id}
                                data={tempat}
                                onDetail={() => handleDetail(tempat.id)}
                                onDaftar={() => handleDaftar(tempat.id)}
                            />
                        ))
                    )}
                </div>

                {/* Pagination Info */}
                <Pagination
                    itemsPerPage={limit}
                    totalItems={dudiList.length}
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </div>

            {/* Modal Detail */}
            {selectedDudi && (
                <ModalDetailTempatMagang
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onDaftar={() => handleDaftar(selectedDudi.id)}
                    data={selectedDudi}
                />
            )}
            
        </div>
    );
}