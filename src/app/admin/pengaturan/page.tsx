"use client";

import { useState, useEffect } from "react";
import { Building2, Upload, MapPin, Phone, Mail, Globe, User, Hash, Eye, FileText, Image as ImageIcon } from "lucide-react";
import FormInput from "@/components/common/FormInput";
import Button from "@/components/common/Button";
import { schoolSettingsService } from "@/app/service/schoolSettingsService";
import { Toasts } from "@/components/modal/Toast";

export default function PengaturanSekolah() {
    const [formData, setFormData] = useState({
        logo: null as File | null,
        namaSekolah: "",
        alamat: "",
        telepon: "",
        email: "",
        website: "",
        kepalaSekolah: "",
        npsn: ""
    });

    const [logoPreview, setLogoPreview] = useState<string>("/placeholder-logo.png");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch school settings on component mount
    useEffect(() => {
        const fetchSchoolSettings = async () => {
            try {
                setLoading(true);
                const response = await schoolSettingsService.getSchoolSettings();
                
                if (response.success) {
                    const settings = response.data;
                    setFormData({
                        logo: null,
                        namaSekolah: settings.namaSekolah,
                        alamat: settings.alamat,
                        telepon: settings.telepon,
                        email: settings.email,
                        website: settings.website || "",
                        kepalaSekolah: settings.kepalaSekolah,
                        npsn: settings.npsn
                    });
                    
                    // Set logo preview if exists
                    if (settings.logoUrl) {
                        setLogoPreview(settings.logoUrl);
                    }
                } else {
                    Toasts('danger', 4000, 'Error!', response.error || 'Gagal mengambil data pengaturan');
                }
            } catch (error) {
                console.error('Error fetching school settings:', error);
                Toasts('danger', 4000, 'Error!', 'Terjadi kesalahan saat mengambil data');
            } finally {
                setLoading(false);
            }
        };

        fetchSchoolSettings();
    }, []);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, logo: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setSaving(true);
            
            // TODO: Handle logo upload to file storage
            // For now, we'll just save the text data
            const response = await schoolSettingsService.updateSchoolSettings({
                logoUrl: logoPreview !== "/placeholder-logo.png" ? logoPreview : null,
                namaSekolah: formData.namaSekolah,
                alamat: formData.alamat,
                telepon: formData.telepon,
                email: formData.email,
                website: formData.website || null,
                kepalaSekolah: formData.kepalaSekolah,
                npsn: formData.npsn
            });

            if (response.success) {
                Toasts(
                    'success',
                    3000,
                    'Berhasil!',
                    'Pengaturan sekolah berhasil diperbarui'
                );
                setIsEditing(false);
            } else {
                Toasts(
                    'danger',
                    4000,
                    'Gagal!',
                    response.error || 'Gagal memperbarui pengaturan sekolah'
                );
            }
        } catch (error) {
            console.error('Error updating school settings:', error);
            Toasts(
                'danger',
                4000,
                'Error!',
                'Terjadi kesalahan saat memperbarui data'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    if (loading) {
        return (
            <div className="bg-gray-50 p-6 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg">Loading...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className=" bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Pengaturan Sekolah</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Form Section */}
                    <div className="bg-white rounded-lg shadow max-h-220">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <Building2 size={20} className="text-cyan-500" />
                                <h2 className="font-semibold text-gray-900">Informasi Sekolah</h2>
                            </div>
                            {!isEditing && (
                                <Button
                                    variant="custom"
                                    customColor={{
                                        bg: 'bg-cyan-500',
                                        hover: 'hover:bg-cyan-600',
                                        text: 'text-white'
                                    }}
                                    size="sm"
                                    onClick={handleEdit}
                                >
                                    Edit
                                </Button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Logo Sekolah
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon size={24} className="text-gray-400" />
                                        )}
                                    </div>
                                    <label className={`cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 ${!isEditing ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <Upload size={16} />
                                        Upload Logo
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            disabled={!isEditing}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Nama Sekolah */}
                            <FormInput
                                label="Nama Sekolah/Instansi"
                                name="namaSekolah"
                                value={formData.namaSekolah}
                                onChange={(value) => handleChange("namaSekolah", value)}
                                placeholder="Masukkan nama sekolah"
                                icon={Building2}
                                disabled={!isEditing}
                                required
                            />

                            {/* Alamat */}
                            <FormInput
                                label="Alamat Lengkap"
                                name="alamat"
                                value={formData.alamat}
                                onChange={(value) => handleChange("alamat", value)}
                                placeholder="Masukkan alamat lengkap"
                                icon={MapPin}
                                disabled={!isEditing}
                                required
                            />

                            {/* Telepon & Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput
                                    label="Telepon"
                                    name="telepon"
                                    value={formData.telepon}
                                    onChange={(value) => handleChange("telepon", value)}
                                    placeholder="08xx-xxxx-xxxx"
                                    icon={Phone}
                                    disabled={!isEditing}
                                    required
                                />

                                <FormInput
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(value) => handleChange("email", value)}
                                    placeholder="email@sekolah.sch.id"
                                    icon={Mail}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>

                            {/* Website */}
                            <FormInput
                                label="Website"
                                name="website"
                                value={formData.website}
                                onChange={(value) => handleChange("website", value)}
                                placeholder="www.sekolah.sch.id"
                                icon={Globe}
                                disabled={!isEditing}
                            />

                            {/* Kepala Sekolah */}
                            <FormInput
                                label="Kepala Sekolah"
                                name="kepalaSekolah"
                                value={formData.kepalaSekolah}
                                onChange={(value) => handleChange("kepalaSekolah", value)}
                                placeholder="Nama kepala sekolah"
                                icon={User}
                                disabled={!isEditing}
                                required
                            />

                            {/* NPSN */}
                            <FormInput
                                label="NPSN (Nomor Pokok Sekolah Nasional)"
                                name="npsn"
                                value={formData.npsn}
                                onChange={(value) => handleChange("npsn", value)}
                                placeholder="Masukkan NPSN"
                                icon={Hash}
                                disabled={!isEditing}
                                required
                            />

                            {/* Last Updated */}
                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-500">
                                    Terakhir diperbarui: 3 Januari 2024 pukul 07:06
                                </p>
                            </div>

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-400 to-sky-700 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            "Simpan Perubahan"
                                        )}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Preview Section */}
                    <div className="space-y-6">
                        {/* Preview Tampilan */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Eye size={20} className="text-cyan-500" />
                                <h3 className="font-semibold text-gray-900">Preview Tampilan</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                Pratinjau bagaimana informasi sekolah akan ditampilkan
                            </p>

                            {/* Dashboard Header Preview */}
                            <div className="border border-gray-200 rounded-lg p-4 mb-4">
                                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                                    <Eye size={14} />
                                    Dashboard Header
                                </p>
                                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon size={24} className="text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{formData.namaSekolah}</h4>
                                        <p className="text-sm text-cyan-600">Sistem Informasi Magang</p>
                                    </div>
                                </div>
                            </div>

                            {/* Header Rapor/Sertifikat Preview */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                                    <FileText size={14} />
                                    Header Rapor/Sertifikat
                                </p>
                                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                                    <div className="flex justify-center mb-3">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon size={28} className="text-gray-400" />
                                            )}
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-1">{formData.namaSekolah}</h4>
                                    <p className="text-xs text-gray-600 mb-2">{formData.alamat}</p>
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <p>Telp: {formData.telepon} Email: {formData.email}</p>
                                        <p>Web: {formData.website}</p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <p className="text-sm font-semibold text-gray-900">SERTIFIKAT MAGANG</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dokumen Cetak Preview */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText size={20} className="text-cyan-500" />
                                <h3 className="font-semibold text-gray-900">Dokumen Cetak</h3>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                                <div className="flex justify-center mb-3">
                                    <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon size={24} className="text-gray-400" />
                                        )}
                                    </div>
                                </div>
                                <h4 className="font-bold text-sm text-gray-900">{formData.namaSekolah}</h4>
                                <p className="text-xs text-gray-600 mt-1">NPSN: {formData.npsn}</p>
                                <p className="text-xs text-gray-500 mt-2">{formData.alamat}</p>
                                <p className="text-xs text-gray-500 mt-1">{formData.telepon}</p>
                                <p className="text-xs text-gray-500">{formData.email}</p>
                                <p className="text-xs text-gray-600 mt-3 font-medium">Kepala Sekolah: {formData.kepalaSekolah}</p>
                            </div>
                        </div>

                        {/* Informasi Penggunaan */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">Informasi Penggunaan:</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li className="flex items-start gap-2">
                                    <Eye size={16} className="mt-0.5 flex-shrink-0" />
                                    <span><strong>Dashboard:</strong> Logo dan nama sekolah ditampilkan di header navigasi</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <FileText size={16} className="mt-0.5 flex-shrink-0" />
                                    <span><strong>Rapor/Sertifikat:</strong> Informasi lengkap sebagai kop dokumen resmi</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <FileText size={16} className="mt-0.5 flex-shrink-0" />
                                    <span><strong>Dokumen Cetak:</strong> Footer atau header pada laporan yang dicetak</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}