import { X, Calendar, User, Building2, FileText, MessageSquare, ThumbsUp, ThumbsDown, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import FormTextarea from '@/components/common/textArea';
import { getLogbookStatus } from '@/helper/LogBookHelper';
import { LogbookData } from '@/app/service/logbookService';

interface DetailJurnalModalProps {
  isOpen: boolean;
  onClose: () => void;
  jurnal: LogbookData | null;
  onSubmit: (id: number, status: 'approved' | 'rejected', catatan: string) => void;
}

export default function DetailJurnalModal({ isOpen, onClose, jurnal, onSubmit }: DetailJurnalModalProps) {
  const [catatan, setCatatan] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'approved' | 'rejected' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (jurnal) {
      setCatatan(jurnal.catatanGuru || '');
      setSelectedStatus(null);
    }
  }, [jurnal]);

  if (!isOpen || !jurnal) return null;

  const statusInfo = getLogbookStatus(jurnal.statusVerifikasi);

  const handleSubmit = async () => {
    if (!selectedStatus) {
      alert('Pilih status terlebih dahulu (Setujui atau Tolak)');
      return;
    }

    if (!catatan.trim()) {
      alert('Catatan guru harus diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(jurnal.id, selectedStatus, catatan);
      onClose();
    } catch (error) {
      console.error('Error submitting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/30">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText size={24} />
            <div>
              <h2 className="text-xl font-bold">Detail Jurnal Harian</h2>
              <p className="text-sm text-cyan-50">Verifikasi & Berikan Catatan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          {/* Student Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-cyan-100 p-2 rounded-lg">
                  <User className="text-cyan-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Nama Siswa</p>
                  <p className="font-semibold text-gray-900">{jurnal.magang.siswa.nama}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Building2 className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">NIS</p>
                  <p className="font-semibold text-gray-900">{jurnal.magang.siswa.nis}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tanggal</p>
                  <p className="font-semibold text-gray-900">{jurnal.tanggal}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Building2 className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tempat Magang</p>
                  <p className="font-semibold text-gray-900">{jurnal.magang.dudi.namaPerusahaan}</p>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Status Saat Ini</p>
              <span className={`${statusInfo.bgColor} ${statusInfo.textColor} px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-2`}>
                {statusInfo.IconComponent && <statusInfo.IconComponent size={16} />}
                {statusInfo.label}
              </span>
            </div>
          </div>

          {/* Jurnal Content */}
          <div className="space-y-4 mb-6">
            {/* Kegiatan */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FileText size={18} className="text-cyan-500" />
                Kegiatan yang Dilakukan
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {jurnal.kegiatan}
              </p>
            </div>

            {/* Kendala */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MessageSquare size={18} className="text-amber-500" />
                Kendala yang Dihadapi
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {jurnal.kendala || 'Tidak ada kendala'}
              </p>
            </div>
          </div>

          {/* Verification Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border-2 border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="text-cyan-500" />
              Verifikasi Jurnal
            </h3>

            {/* Status Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Pilih Status Verifikasi <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedStatus('approved')}
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    selectedStatus === 'approved'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <ThumbsUp size={20} />
                  <span className="font-semibold">Setujui</span>
                </button>

                <button
                  onClick={() => setSelectedStatus('rejected')}
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    selectedStatus === 'rejected'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-red-300 hover:bg-red-50'
                  }`}
                >
                  <ThumbsDown size={20} />
                  <span className="font-semibold">Tolak</span>
                </button>
              </div>
            </div>

            {/* Catatan Guru */}
            <FormTextarea
              label="Catatan Guru"
              name="catatan"
              value={catatan}
              onChange={setCatatan}
              placeholder={
                selectedStatus === 'approved'
                  ? 'Berikan apresiasi atau saran untuk siswa...'
                  : selectedStatus === 'rejected'
                  ? 'Jelaskan alasan penolakan dan saran perbaikan...'
                  : 'Berikan catatan atau feedback untuk siswa...'
              }
              rows={5}
              maxLength={500}
              showCharCount
              required
              className="mb-0"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedStatus || !catatan.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save size={18} />
            {isSubmitting ? 'Menyimpan...' : 'Simpan Verifikasi'}
          </button>
        </div>
      </div>
    </div>
  );
}

