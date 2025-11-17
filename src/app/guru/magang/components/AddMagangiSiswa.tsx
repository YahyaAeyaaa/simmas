import React, { useState, useEffect } from 'react';
import { X, Users, GraduationCap, Building2, Calendar, CheckCircle } from 'lucide-react';
import { siswaService, SiswaData } from '@/app/service/siswaApiService';
import { guruService, GuruData } from '@/app/service/guruApiService';
import { dudiService } from '@/app/service/dudiService';
import { magangService } from '@/app/service/magangApiService';
import { DudiData } from '@/helper/status';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Pilih opsi",
  error,
  required = false,
  disabled = false
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors appearance-none ${
          disabled 
            ? "bg-gray-100 cursor-not-allowed text-gray-600" 
            : error 
              ? "border-red-500 focus:ring-red-200" 
              : "border-gray-300 focus:ring-cyan-200 focus:border-cyan-500"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

interface FormDateProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

const FormDate: React.FC<FormDateProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="date"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
          error 
            ? "border-red-500 focus:ring-red-200" 
            : "border-gray-300 focus:ring-cyan-200 focus:border-cyan-500"
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

interface ModalTambahMagangProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const ModalTambahMagang = ({ isOpen, onClose, onSubmit }: ModalTambahMagangProps) => {
  const [formData, setFormData] = useState({
    siswa: '',
    guruPembimbing: '',
    dudi: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    status: 'pending'
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  // State untuk menyimpan data dari API
  const [siswaList, setSiswaList] = useState<SiswaData[]>([]);
  const [dudiList, setDudiList] = useState<DudiData[]>([]);
  const [currentGuru, setCurrentGuru] = useState<GuruData | null>(null);

  // Fetch data saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      fetchAllData();
    }
  }, [isOpen]);

  const fetchAllData = async () => {
    setFetchingData(true);
    try {
      // Fetch siswa, dudi, dan guru secara parallel
      const [siswaResponse, dudiResponse, guruResponse] = await Promise.all([
        siswaService.getSiswaList(),
        dudiService.getDudiList(),
        guruService.getCurrentGuru()
      ]);

      if (siswaResponse.success) {
        setSiswaList(siswaResponse.data);
      }

      if (dudiResponse.success) {
        // Filter hanya DUDI yang aktif
        const activeDudi = dudiResponse.data.filter(d => d.status === 'aktif');
        setDudiList(activeDudi);
      }

      if (guruResponse.success) {
        setCurrentGuru(guruResponse.data);
        // Auto-fill guru pembimbing
        setFormData(prev => ({ 
          ...prev, 
          guruPembimbing: guruResponse.data.id.toString() 
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetchingData(false);
    }
  };

  // Convert data ke options untuk select
  const siswaOptions: SelectOption[] = siswaList.map(s => ({
    value: s.id.toString(),
    label: `${s.nama}`
  }));

  const dudiOptions: SelectOption[] = dudiList.map(d => ({
    value: d.id.toString(),
    label: `${d.namaPerusahaan} - ${d.alamat}`
  }));

  const statusOptions: SelectOption[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'berlangsung', label: 'Berlangsung (Aktif)' },
    { value: 'selesai', label: 'Selesai' }
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.siswa) newErrors.siswa = 'Siswa harus dipilih';
    if (!formData.guruPembimbing) newErrors.guruPembimbing = 'Guru pembimbing harus dipilih';
    if (!formData.dudi) newErrors.dudi = 'DUDI harus dipilih';
    if (!formData.tanggalMulai) newErrors.tanggalMulai = 'Tanggal mulai harus diisi';
    if (!formData.tanggalSelesai) newErrors.tanggalSelesai = 'Tanggal selesai harus diisi';
    if (!formData.status) newErrors.status = 'Status harus dipilih';

    if (formData.tanggalMulai && formData.tanggalSelesai) {
      if (new Date(formData.tanggalMulai) >= new Date(formData.tanggalSelesai)) {
        newErrors.tanggalSelesai = 'Tanggal selesai harus setelah tanggal mulai';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await magangService.createMagang({
        siswaId: parseInt(formData.siswa),
        dudiId: parseInt(formData.dudi),
        guruId: parseInt(formData.guruPembimbing),
        tanggalMulai: formData.tanggalMulai,
        tanggalSelesai: formData.tanggalSelesai,
        status: formData.status as 'pending' | 'berlangsung' | 'selesai'
      });

      if (response.success) {
        onSubmit(response.data);
        handleReset();
      } else {
        setErrors({ submit: response.error || 'Gagal menambahkan data magang' });
      }
    } catch (error) {
      console.error('Error submitting magang:', error);
      setErrors({ submit: 'Terjadi kesalahan saat menambahkan data' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      siswa: '',
      guruPembimbing: currentGuru?.id.toString() || '',
      dudi: '',
      tanggalMulai: '',
      tanggalSelesai: '',
      status: 'pending'
    });
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/30">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-cyan-500 to-blue-600">
          <div>
            <h2 className="text-xl font-semibold text-white">Tambah Data Siswa Magang</h2>
            <p className="text-cyan-50 text-sm mt-1">Masukkan informasi data magang siswa baru</p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-white hover:bg-white hover:text-cyan-500 hover:bg-opacity-20 rounded-lg p-2 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="px-6 py-6 space-y-6">
            {fetchingData ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                <p className="mt-2 text-gray-600">Memuat data...</p>
              </div>
            ) : (
              <>
                {/* Error submit */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {errors.submit}
                  </div>
                )}

                {/* Siswa & Pembimbing Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="text-cyan-500" size={20} />
                    Siswa & Pembimbing
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSelect
                      label="Siswa"
                      name="siswa"
                      value={formData.siswa}
                      onChange={(value) => handleChange('siswa', value)}
                      options={siswaOptions}
                      placeholder="Pilih Siswa"
                      error={errors.siswa}
                      required
                      disabled={loading}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Guru Pembimbing <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700">
                        {currentGuru ? `${currentGuru.nama} - ${currentGuru.nip}` : 'Loading...'}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Otomatis terisi (Anda yang login)</p>
                    </div>
                  </div>
                </div>

                {/* Tempat Magang Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 className="text-cyan-500" size={20} />
                    Tempat Magang
                  </h3>
                  <FormSelect
                    label="Dunia Usaha/Dunia Industri"
                    name="dudi"
                    value={formData.dudi}
                    onChange={(value) => handleChange('dudi', value)}
                    options={dudiOptions}
                    placeholder="Pilih DUDI"
                    error={errors.dudi}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Periode & Status Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="text-cyan-500" size={20} />
                    Periode & Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormDate
                      label="Tanggal Mulai"
                      name="tanggalMulai"
                      value={formData.tanggalMulai}
                      onChange={(value) => handleChange('tanggalMulai', value)}
                      error={errors.tanggalMulai}
                      required
                    />
                    <FormDate
                      label="Tanggal Selesai"
                      name="tanggalSelesai"
                      value={formData.tanggalSelesai}
                      onChange={(value) => handleChange('tanggalSelesai', value)}
                      error={errors.tanggalSelesai}
                      required
                    />
                    <FormSelect
                      label="Status"
                      name="status"
                      value={formData.status}
                      onChange={(value) => handleChange('status', value)}
                      options={statusOptions}
                      placeholder="Pilih Status"
                      error={errors.status}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || fetchingData}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Simpan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalTambahMagang;