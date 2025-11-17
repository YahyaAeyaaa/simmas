import React, { useState, useEffect } from 'react';
import { X, Info, Calendar, AlertCircle, Upload } from 'lucide-react';
import FormSelect from '@/components/common/FormSelect';
import FormDateInput from '@/components/common/FormDateInput';
import FormTextarea from '@/components/common/textArea';
import FormFileInput from '@/components/common/FormFileInput';
import { logbookService, CreateLogbookRequest } from '@/app/service/logbookService';
import { Toasts } from '@/components/modal/Toast';

interface ModalTambahJurnalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Main Modal Component
export default function ModalTambahJurnal({ isOpen, onClose, onSuccess }: ModalTambahJurnalProps) {
  const [formData, setFormData] = useState({
    magangId: 0,
    kegiatan: '',
    kendala: '',
    file: null as File | null
  });
  
  const [errors, setErrors] = useState({
    kegiatan: '',
    kendala_2: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [activeMagang, setActiveMagang] = useState<any>(null);

  // Fetch active magang for current student
  useEffect(() => {
    if (isOpen) {
      fetchActiveMagang();
    }
  }, [isOpen]);

  const fetchActiveMagang = async () => {
    try {
      const response = await fetch('/api/siswa/active-magang', {
        method: 'GET',
        credentials: 'same-origin',
      });

      const data = await response.json();

      if (data.success) {
        setActiveMagang(data.data);
        setFormData(prev => ({ ...prev, magangId: data.data.id }));
      } else {
        console.error('No active magang:', data.error);
        Toasts('warning', 4000, 'Perhatian', 'Anda belum memiliki magang aktif');
      }
    } catch (error) {
      console.error('Error fetching active magang:', error);
      Toasts('danger', 4000, 'Error', 'Gagal mengambil data magang');
    }
  };

  const validateForm = () => {
    const newErrors = {
      kegiatan: '',
      kendala: ''
    };
    let isValid = true;

    if (!formData.kegiatan.trim()) {
      newErrors.kegiatan = 'Deskripsi kegiatan wajib diisi';
      isValid = false;
    } else if (formData.kegiatan.trim().length < 50) {
      newErrors.kegiatan = 'Deskripsi kegiatan minimal 50 karakter';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!activeMagang) {
      Toasts('danger', 4000, 'Error', 'Tidak ada magang aktif');
      return;
    }

    setIsLoading(true);
    
    try {
      const logbookData: CreateLogbookRequest = {
        magangId: activeMagang.id,
        kegiatan: formData.kegiatan,
        kendala: formData.kendala,
        file: formData.file ? formData.file.name : '' // For now, just send filename
      };

      const response = await logbookService.createLogbook(logbookData);
      
      if (response.success) {
        Toasts('success', 3000, 'Berhasil!', 'Jurnal harian berhasil dibuat');
        onSuccess?.();
        handleClose();
      }
    } catch (error: any) {
      console.error('Error creating logbook:', error);
      Toasts('danger', 4000, 'Gagal!', error.message || 'Gagal membuat jurnal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        magangId: 0,
        kegiatan: '',
        kendala: '',
        file: null
      });
      setErrors({
        kegiatan: '',
        kendala: ''
      });
      onClose();
    }
  };

  const handleChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/30">
      {/* Overlay */}
      <div 
        className="absolute inset-0"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200 rounded-t-lg z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Tambah Jurnal Harian</h2>
            <p className="text-sm text-gray-500 mt-1">Dokumentasikan kegiatan magang harian Anda</p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800 text-sm mb-2">Panduan Penulisan Jurnal</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Minimal 50 karakter untuk deskripsi kegiatan</li>
                  <li>• Deskripsikan kegiatan dengan detail dan spesifik</li>
                  <li>• Sertakan kendala jika ada</li>
                  <li>• Upload dokumentasi pendukung untuk memperkuat laporan</li>
                  <li>• Pastikan tanggal sesuai dengan hari kerja</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Informasi Dasar */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Informasi Dasar</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Tanggal:</strong> {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              {activeMagang ? (
                <>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Perusahaan:</strong> {activeMagang.dudi.namaPerusahaan}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Guru Pembimbing:</strong> {activeMagang.guru.nama}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Jurnal akan otomatis dikirim ke guru pembimbing Anda
                  </p>
                </>
              ) : (
                <p className="text-sm text-red-500 mt-1">
                  Tidak ada magang aktif. Silakan hubungi admin.
                </p>
              )}
            </div>
          </div>

          {/* Kegiatan Harian */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Kegiatan Harian</h3>
            
            {/* Deskripsi Kegiatan */}
            <div className="mb-4">
              <FormTextarea
                onChange={(value) => handleChange('kegiatan', value)}
                label="Deskripsi Kegiatan"
                name="kegiatan"
                value={formData.kegiatan}
                placeholder="Deskripsikan kegiatan yang Anda lakukan hari ini secara detail. Contoh: Membuat wireframe untuk halaman login menggunakan Figma, kemudian melakukan coding HTML dan CSS untuk implementasi desain tersebut..."
                required={true}
                rows={4}
                maxLength={1000}
                showCharCount={true}
                error={errors.kegiatan}
                disabled={isLoading}
              />
            </div>

            {/* Kendala/Hambatan */}
            <div className="mb-4">
              <FormTextarea
                onChange={(value) => handleChange('kendala', value)}
                label="Kendala/Hambatan (Opsional)"
                name="kendala"
                value={formData.kendala}
                placeholder="Jelaskan kendala atau hambatan yang Anda hadapi hari ini. Contoh: Kesulitan memahami konsep React hooks, masalah dengan database connection, dll..."
                required={false}
                rows={3}
                maxLength={500}
                showCharCount={true}
                error={errors.kendala}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Dokumentasi Pendukung */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Dokumentasi Pendukung</h3>
            <FormFileInput
              value={formData.file}
              onChange={(value) => handleChange('file', value)}
              name="file"
              label="Upload File (Opsional)"
              helperText="Jenis file yang dapat diunggah: Screenshot hasil kerja, dokumentasi code, foto kegiatan"
              disabled={isLoading}
              accept="image/*,.pdf,.doc,.docx"
              maxSize={10}
              showPreview={true}
            />
          </div>

          {/* Error Alert */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800 text-sm mb-2">Lengkapi form terlebih dahulu!</p>
                <ul className="text-sm text-red-600 space-y-1">
                  <li>• Deskripsi kegiatan minimal 50 karakter</li>
                  <li>• Pastikan Anda sedang dalam status magang aktif</li>
                </ul>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button 
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button 
            type="submit"
            disabled={isLoading || !activeMagang}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : !activeMagang ? (
              'Tidak Ada Magang Aktif'
            ) : (
              'Simpan Jurnal'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}