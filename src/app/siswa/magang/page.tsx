'use client';

import InfoRow from "@/components/common/InfroRow";
import { User, Building2, Calendar, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { getMagangStatus, MagangStatusData } from "@/app/service/siswaMagangService";

export default function StatusMagangSaya() {
  const [magangData, setMagangData] = useState<MagangStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getMagangStatus();
      
      if (result.success && result.data) {
        setMagangData(result.data);
        setError(null);
      } else {
        setError(result.error || 'Gagal memuat data magang');
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aktif':
        return <span className="text-green-600 font-semibold">Aktif</span>;
      case 'selesai':
        return <span className="text-blue-600 font-semibold">Selesai</span>;
      case 'pending':
        return <span className="text-yellow-600 font-semibold">Menunggu Persetujuan</span>;
      default:
        return <span className="text-gray-600 font-semibold">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data magang...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <p className="text-sm text-gray-600 mt-2">
              Anda belum terdaftar dalam program magang atau data tidak ditemukan.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!magangData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 w-300">
      <div className="max-w-2xl mx-auto">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Status Magang Saya</h2>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Data Siswa Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <User size={18} className="text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-700">Data Siswa</h3>
              </div>
              
              <div className="space-y-0">
                <InfoRow label="Nama Siswa" value={magangData.siswa.nama} />
                <InfoRow label="NIS" value={magangData.siswa.nis} />
                <InfoRow label="Kelas" value={magangData.siswa.kelas} />
                <InfoRow label="Jurusan" value={magangData.siswa.jurusan} />
              </div>
            </div>

            {/* Data Perusahaan Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={18} className="text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-700">Tempat Magang</h3>
              </div>
              
              <div className="space-y-0">
                <InfoRow label="Nama Perusahaan" value={magangData.dudi.namaPerusahaan} />
                <InfoRow label="Alamat Perusahaan" value={magangData.dudi.alamat} />
                <InfoRow label="Bidang Usaha" value={magangData.dudi.bidangUsaha} />
              </div>
            </div>

            {/* Periode Magang Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={18} className="text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-700">Periode Magang</h3>
              </div>
              
              <div className="space-y-0">
                {/* Status Row with custom badge */}
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Status</span>
                  <span>{getStatusBadge(magangData.periode.status)}</span>
                </div>
                <InfoRow 
                  label="Periode" 
                  value={`${formatDate(magangData.periode.tanggalMulai)} s.d ${formatDate(magangData.periode.tanggalSelesai)}`} 
                />
              </div>
            </div>

            {/* Guru Pembimbing Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <User size={18} className="text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-700">Guru Pembimbing</h3>
              </div>
              
              <div className="space-y-0">
                <InfoRow label="Nama Guru" value={magangData.guru.nama} />
                <InfoRow label="NIP" value={magangData.guru.nip} />
              </div>
            </div>

            {/* Nilai Akhir Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Award size={18} className="text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-700">Nilai Akhir</h3>
              </div>
              
              <div className="space-y-0">
                <InfoRow 
                  label="Nilai" 
                  value={magangData.nilaiAkhir ? magangData.nilaiAkhir.toString() : "Belum ada nilai"} 
                  valueClass={magangData.nilaiAkhir ? "text-green-600 font-bold text-lg" : "text-gray-400"}
                />
                {!magangData.nilaiAkhir && (
                  <p className="text-xs text-gray-500 mt-2 italic">
                    * Nilai akan diisi oleh guru pembimbing setelah magang selesai
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}