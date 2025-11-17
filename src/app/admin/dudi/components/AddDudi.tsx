"use client";

import { useState, useEffect } from "react";
import { X, Building2, MapPin, Phone, Mail, User, Activity, Briefcase, FileText, Users, GraduationCap } from "lucide-react";
import FormInput from "@/components/common/FormInput";
import FormSelect from "@/components/common/FormSelect";
import FormTextarea from "@/components/common/textArea";

interface Guru {
    id: number;
    nama: string;
    nip: string;
}

interface ModalAddDudiProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
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
    }) => Promise<void>;
}

export default function ModalAddDudi({ isOpen, onClose, onSubmit }: ModalAddDudiProps) {
    const [formData, setFormData] = useState({
        namaPerusahaan: "",
        alamat: "",
        telepon: "",
        email: "",
        penanggungJawab: "",
        bidangUsaha: "",
        deskripsi: "",
        kuotaMagang: 0,
        status: "",
        guruPenanggungJawabId: null as number | null
    });
    
    const [gurus, setGurus] = useState<Guru[]>([]);
    
    const [errors, setErrors] = useState({
        namaPerusahaan: "",
        alamat: "",
        telepon: "",
        email: "",
        penanggungJawab: "",
        bidangUsaha: "",
        deskripsi: "",
        kuotaMagang: "",
        status: "",
        guruPenanggungJawabId: "",
        general: ""
    });
    
    const [isLoading, setIsLoading] = useState(false);

    // Fetch gurus when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchGurus();
        }
    }, [isOpen]);

    const fetchGurus = async () => {
        try {
            const response = await fetch('/api/guru/list');
            const data = await response.json();
            
            if (data.success) {
                setGurus(data.data);
            }
        } catch (error) {
            console.error('Error fetching gurus:', error);
        }
    };

    if (!isOpen) return null;

    const statusOptions = [
        { value: "aktif", label: "Aktif" },
        { value: "pending", label: "Pending" },
        { value: "nonaktif", label: "Tidak Aktif" }
    ];

    const guruOptions = [
        { value: "", label: "Pilih Guru Penanggung Jawab (Opsional)" },
        ...gurus.map(guru => ({
            value: guru.id.toString(),
            label: `${guru.nama}`
        }))
    ];

    const validateForm = () => {
        const newErrors = {
            namaPerusahaan: "",
            alamat: "",
            telepon: "",
            email: "",
            penanggungJawab: "",
            bidangUsaha: "",
            deskripsi: "",
            kuotaMagang: "",
            status: "",
            general: ""
        };
        let isValid = true;

        if (!formData.namaPerusahaan.trim()) {
            newErrors.namaPerusahaan = "Nama perusahaan wajib diisi";
            isValid = false;
        }

        if (!formData.alamat.trim()) {
            newErrors.alamat = "Alamat wajib diisi";
            isValid = false;
        }

        if (!formData.telepon.trim()) {
            newErrors.telepon = "Telepon wajib diisi";
            isValid = false;
        } else if (!/^[0-9+\-\s()]+$/.test(formData.telepon)) {
            newErrors.telepon = "Format telepon tidak valid";
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email wajib diisi";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Format email tidak valid";
            isValid = false;
        }

        if (!formData.penanggungJawab.trim()) {
            newErrors.penanggungJawab = "Penanggung jawab wajib diisi";
            isValid = false;
        }

        if (!formData.bidangUsaha.trim()) {
            newErrors.bidangUsaha = "Bidang usaha wajib diisi";
            isValid = false;
        }

        if (!formData.deskripsi.trim()) {
            newErrors.deskripsi = "Deskripsi wajib diisi";
            isValid = false;
        }

        if (formData.kuotaMagang < 0) {
            newErrors.kuotaMagang = "Kuota magang tidak boleh negatif";
            isValid = false;
        }

        if (!formData.status) {
            newErrors.status = "Status wajib dipilih";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        
        try {
            // Call parent onSubmit and wait for it to complete
            await onSubmit(formData);
            handleClose();
        } catch (error) {
            console.error('Error in form submission:', error);
            setErrors(prev => ({
                ...prev,
                general: error instanceof Error ? error.message : 'Terjadi kesalahan saat menambahkan dudi'
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setFormData({
                namaPerusahaan: "",
                alamat: "",
                telepon: "",
                email: "",
                penanggungJawab: "",
                bidangUsaha: "",
                deskripsi: "",
                kuotaMagang: 0,
                status: "",
                guruPenanggungJawabId: null
            });
            setErrors({
                namaPerusahaan: "",
                alamat: "",
                telepon: "",
                email: "",
                penanggungJawab: "",
                bidangUsaha: "",
                deskripsi: "",
                kuotaMagang: "",
                status: "",
                guruPenanggungJawabId: "",
                general: ""
            });
            onClose();
        }
    };

    const handleChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

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
                <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-200 rounded-t-lg z-10">
                    <h3 className="text-lg font-semibold text-gray-900">Tambah DUDI Baru</h3>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-4">
                    {/* General Error Display */}
                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{errors.general}</p>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        {/* Nama Perusahaan */}
                        <FormInput
                            label="Nama Perusahaan"
                            name="namaPerusahaan"
                            value={formData.namaPerusahaan}
                            onChange={(value) => handleChange("namaPerusahaan", value)}
                            placeholder="Masukkan nama perusahaan"
                            icon={Building2}
                            error={errors.namaPerusahaan}
                            disabled={isLoading}
                            required
                        />

                        {/* Alamat */}
                        <FormInput
                            label="Alamat"
                            name="alamat"
                            value={formData.alamat}
                            onChange={(value) => handleChange("alamat", value)}
                            placeholder="Masukkan alamat lengkap"
                            icon={MapPin}
                            error={errors.alamat}
                            disabled={isLoading}
                            required
                        />

                        {/* Grid 2 Columns untuk Telepon dan Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Telepon */}
                            <FormInput
                                label="Telepon"
                                name="telepon"
                                type="text"
                                value={formData.telepon}
                                onChange={(value) => handleChange("telepon", value)}
                                placeholder="08xx-xxxx-xxxx"
                                icon={Phone}
                                error={errors.telepon}
                                disabled={isLoading}
                                required
                            />

                            {/* Email */}
                            <FormInput
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={(value) => handleChange("email", value)}
                                placeholder="perusahaan@example.com"
                                icon={Mail}
                                error={errors.email}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/* Bidang Usaha */}
                        <FormInput
                            label="Bidang Usaha"
                            name="bidangUsaha"
                            value={formData.bidangUsaha}
                            onChange={(value) => handleChange("bidangUsaha", value)}
                            placeholder="Contoh: Software Internet, Digital Marketing, dll"
                            icon={Briefcase}
                            error={errors.bidangUsaha}
                            disabled={isLoading}
                            required
                        />

                        {/* Deskripsi Perusahaan */}
                        <FormTextarea
                            label="Deskripsi Perusahaan"
                            name="deskripsi"
                            value={formData.deskripsi}
                            onChange={(value) => handleChange("deskripsi", value)}
                            placeholder="Deskripsikan perusahaan, visi misi, dan kesempatan magang yang ditawarkan..."
                            icon={FileText}
                            error={errors.deskripsi}
                            disabled={isLoading}
                            required
                            rows={4}
                            maxLength={500}
                            showCharCount
                        />

                        {/* Grid 3 Columns untuk Penanggung Jawab, Kuota Magang, dan Status */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Penanggung Jawab */}
                            <FormInput
                                label="Penanggung Jawab"
                                name="penanggungJawab"
                                value={formData.penanggungJawab}
                                onChange={(value) => handleChange("penanggungJawab", value)}
                                placeholder="Nama penanggung jawab"
                                icon={User}
                                error={errors.penanggungJawab}
                                disabled={isLoading}
                                required
                            />

                            {/* Kuota Magang */}
                            <FormInput
                                label="Kuota Magang"
                                name="kuotaMagang"
                                type="number"
                                value={formData.kuotaMagang.toString()}
                                onChange={(value) => handleChange("kuotaMagang", parseInt(value) || 0)}
                                placeholder="Jumlah slot magang"
                                icon={Users}
                                error={errors.kuotaMagang}
                                disabled={isLoading}
                                required
                            />

                            {/* Status */}
                            <FormSelect
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={(value) => handleChange("status", value)}
                                options={statusOptions}
                                placeholder="Pilih status"
                                icon={Activity}
                                error={errors.status}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/* Guru Penanggung Jawab */}
                        <FormSelect
                            label="Guru Penanggung Jawab"
                            name="guruPenanggungJawabId"
                            value={formData.guruPenanggungJawabId?.toString() || ""}
                            onChange={(value) => handleChange("guruPenanggungJawabId", value ? parseInt(value) : null)}
                            options={guruOptions}
                            placeholder="Pilih guru penanggung jawab"
                            icon={GraduationCap}
                            error={errors.guruPenanggungJawabId}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-400 to-sky-700 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                "Tambah DUDI"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}