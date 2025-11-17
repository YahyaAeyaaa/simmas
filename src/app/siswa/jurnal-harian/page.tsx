"use client";

import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Pagination from "@/components/common/pagination";
import SearchInput from "@/components/common/Serach";
import FormSelect from "@/components/common/FormSelect";
import { Plus, FileText, CheckCircle, Clock, XCircle, Filter, ChevronDown, Eye, Edit, Trash2 , MessageCircle  } from "lucide-react";
import { useState, useEffect } from "react";
import ModalTambahJurnal from "./components/AddJurnal";
import { logbookService, LogbookData } from "@/app/service/logbookService";
import { Toasts } from "@/components/modal/Toast";

export default function JurnalHarianMagang() {
    const [searchValue, setSearchValue] = useState('');
    const [status, setStatus] = useState('');
    const [bulan, setBulan] = useState('');
    const [tahun, setTahun] = useState('');
    const [statusOptions, setStatusOptions] = useState([]);
    const [bulanOptions, setBulanOptions] = useState([]);
    const [tahunOptions, setTahunOptions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Jurnal data states
    const [jurnalList, setJurnalList] = useState<LogbookData[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalJurnal: 0,
        disetujui: 0,
        menunggu: 0,
        ditolak: 0
    });
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);

    // Fetch jurnal data
    useEffect(() => {
        fetchJurnalData();
    }, [searchValue, status, currentPage]);

    const fetchJurnalData = async () => {
        try {
            setLoading(true);
            
            // Fetch jurnal list with pagination
            const jurnalResponse = await logbookService.getLogbooks(
                currentPage, 
                limit, 
                status, 
                searchValue
            );
            
            if (jurnalResponse.success) {
                setJurnalList(jurnalResponse.data);
                setTotalPages(jurnalResponse.pagination.totalPages);
                setTotalItems(jurnalResponse.pagination.totalItems);
            }
            
            // Fetch stats separately
            const statsResponse = await logbookService.getLogbookStats();
            if (statsResponse.success && statsResponse.data) {
                setStats({
                    totalJurnal: statsResponse.data.totalLogbook,
                    disetujui: statsResponse.data.approvedLogbook,
                    menunggu: statsResponse.data.pendingLogbook,
                    ditolak: statsResponse.data.rejectedLogbook
                });
            }
        } catch (error) {
            console.error('Error fetching jurnal data:', error);
            Toasts('danger', 4000, 'Error', 'Gagal mengambil data jurnal');
        } finally {
            setLoading(false);
        }
    };

    const handleJurnalSuccess = () => {
        setCurrentPage(1); // Reset to first page
        fetchJurnalData(); // Refresh data after successful submission
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = (value: string) => {
        setSearchValue(value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        setCurrentPage(1); // Reset to first page when filtering
    };

    const handleResetFilters = () => {
        setSearchValue('');
        setStatus('');
        setBulan('');
        setTahun('');
        setCurrentPage(1);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const truncateText = (text: string, maxWords: number = 25) => {
        const words = text.split(' ');
        if (words.length <= maxWords) {
            return text;
        }
        return words.slice(0, maxWords).join(' ') + '...';
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Disetujui
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-2xl text-xs font-medium bg-red-100 text-red-700">
                        Ditolak
                    </span>
                );
            case 'pending':
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-2xl text-xs font-medium bg-orange-100 text-orange-700">
                        Menunggu
                    </span>
                );
        }
    };

    return (
      <>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Jurnal Harian Magang</h1>
          </div>
  
          {/* Alert */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg flex items-start justify-between">
            <div className="flex items-start gap-3">
              <FileText className="text-yellow-600 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-gray-800">Jangan Lupa Jurnal Hari Ini!</p>
                <p className="text-sm text-gray-600">Anda belum membuat jurnal untuk hari ini. Dokumentasikan kegiatan magang Anda sekarang!</p>
              </div>
            </div>
            <Button 
              variant="warning" 
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              Buat Sekarang
            </Button>
          </div>
  
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card 
              title="Total Jurnal" 
              total={loading ? 0 : stats.totalJurnal} 
              icon={<FileText className="text-blue-500" size={24} />}
              subtitle="Jurnal yang telah dibuat"
            />
            <Card 
              title="Disetujui" 
              total={loading ? 0 : stats.disetujui} 
              icon={<CheckCircle className="text-green-500" size={24} />}
              subtitle="Jurnal disetujui guru"
            />
            <Card 
              title="Menunggu" 
              total={loading ? 0 : stats.menunggu} 
              icon={<Clock className="text-orange-500" size={24} />}
              subtitle="Belum diverifikasi"
            />
            <Card 
              title="Ditolak" 
              total={loading ? 0 : stats.ditolak} 
              icon={<XCircle className="text-red-500" size={24} />}
              subtitle="Perlu diperbaiki"
            />
          </div>
  
          {/* Riwayat Jurnal */}
          <div className="bg-white w-full rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="text-blue-500" size={20} />
                <h2 className="text-lg font-semibold text-gray-800">Riwayat Jurnal</h2>
              </div>
  
              <SearchInput
                value={searchValue}
                onChange={handleSearch}
                placeholder="Cari kegiatan atau kendala."
                size="md"
                className="w-full max-w-md"
                showClearButton={true}
              />
  
              {/* Filters */}
              <div className="grid grid-cols-3 gap-4 my-4 bg-slate-50 p-4 rounded-xl">
                <div>
                    <FormSelect
                      label="Status"
                      name="status"
                      value={status}
                      onChange={handleStatusChange}
                      options={statusOptions}
                      placeholder="Semua Status"
                    />
                    </div>
                    <div>
                    <FormSelect
                      label="Bulan"
                      name="bulan"
                      value={bulan}
                      onChange={(value) => setBulan(value)}
                      options={bulanOptions}
                      placeholder="Semua Bulan"
                    />
                    </div>
                    <div>
                    <FormSelect
                      label="Tahun"
                      name="tahun"
                      value={tahun}
                      onChange={(value) => setTahun(value)}
                      options={tahunOptions}
                      placeholder="Semua Tahun"
                    />
                    </div>
                <Button 
                  variant="custom" 
                  icon="RotateCcw" 
                  size="sm" 
                  className="max-w-33 bg-white"
                  onClick={handleResetFilters}
                >
                    Reset Filter
                </Button>
              </div>
  
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tanggal</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kegiatan & Kendala</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Feedback Guru</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center">
                          <div className="flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-2 text-gray-600">Memuat data...</span>
                          </div>
                        </td>
                      </tr>
                    ) : jurnalList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center">
                          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                          <p className="text-gray-500">Belum ada jurnal harian</p>
                          <p className="text-sm text-gray-400 mt-1">Klik "Buat Sekarang" untuk membuat jurnal pertama</p>
                        </td>
                      </tr>
                    ) : (
                      jurnalList.map((jurnal) => (
                        <tr key={jurnal.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm text-gray-800">
                            {formatDate(jurnal.tanggal)}
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-medium text-gray-800 mb-1">Kegiatan:</p>
                            <p className="text-sm text-gray-600" title={jurnal.kegiatan}>
                              {truncateText(jurnal.kegiatan)}
                            </p>
                            {jurnal.kendala_2 && (
                              <>
                                <p className="font-medium text-gray-800 mb-1 mt-2">Kendala:</p>
                                <p className="text-sm text-gray-600" title={jurnal.kendala_2}>
                                  {truncateText(jurnal.kendala_2)}
                                </p>
                              </>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            {getStatusBadge(jurnal.statusVerifikasi)}
                          </td>
                          <td className="px-4 py-4">
                            <div className="bg-gray-100 p-6 rounded-xl">
                              <p className="text-sm text-blue-600 mb-1 flex items-center gap-2">
                                <MessageCircle size={18} /> Catatan Guru:
                              </p>
                              {jurnal.catatanGuru ? (
                                <p className="text-sm text-gray-600">{jurnal.catatanGuru}</p>
                              ) : (
                                <p className="text-sm text-gray-500 italic">Belum ada catatan</p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                <Eye size={18} />
                              </button>
                              {jurnal.statusVerifikasi === 'rejected' && (
                                <button className="p-2 text-orange-600 hover:bg-orange-50 rounded">
                                  <Edit size={18} />
                                </button>
                              )}
                              {jurnal.statusVerifikasi === 'pending' && (
                                <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
  
            {/* Pagination */}
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={limit}
              totalItems={totalItems}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Modal Tambah Jurnal */}
        {isModalOpen && (
          <ModalTambahJurnal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleJurnalSuccess}
          />
        )}
      </>
    );
  }
  
  // Import Plus for Button
//   const Plus = ({ size }) => (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <line x1="12" y1="5" x2="12" y2="19"></line>
//       <line x1="5" y1="12" x2="19" y2="12"></line>
//     </svg>
//   );