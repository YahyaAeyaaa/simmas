// File: components/modal/ModalEditMagang.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import FormInput from "@/components/common/FormInput";
import FormSelect from "@/components/common/FormSelect";

interface ModalEditMagangProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        tanggalMulai: string;
        tanggalSelesai: string;
        status: string;
        nilaiAkhir: string;
    }) => void;
    initialData?: {
        tanggalMulai: string;
        tanggalSelesai: string;
        status: string;
        nilaiAkhir: string;
    };
}

export default function ModalEditMagang({ 
    isOpen, 
    onClose, 
    onSubmit,
    initialData 
}: ModalEditMagangProps) {
    const [formData, setFormData] = useState({
        tanggalMulai: "",
        tanggalSelesai: "",
        status: "",
        nilaiAkhir: ""
    });

    const [errors, setErrors] = useState({
        tanggalMulai: "",
        tanggalSelesai: "",
        status: "",
        nilaiAkhir: ""
    });

    const [isLoading, setIsLoading] = useState(false);

    const statusOptions = [
        { value: "pending", label: "Pending" },
        { value: "berlangsung", label: "Berlangsung (Aktif)" },
        { value: "selesai", label: "Selesai" }
    ];

    useEffect(() => {
        if (initialData && isOpen) {
            setFormData({
                tanggalMulai: initialData.tanggalMulai || "",
                tanggalSelesai: initialData.tanggalSelesai || "",
                status: initialData.status || "",
                nilaiAkhir: initialData.nilaiAkhir || ""
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        const newErrors = {
            tanggalMulai: "",
            tanggalSelesai: "",
            status: "",
            nilaiAkhir: ""
        };
        let isValid = true;

        if (!formData.tanggalMulai) {
            newErrors.tanggalMulai = "Tanggal mulai harus diisi";
            isValid = false;
        }

        if (!formData.tanggalSelesai) {
            newErrors.tanggalSelesai = "Tanggal selesai harus diisi";
            isValid = false;
        }

        if (formData.tanggalMulai && formData.tanggalSelesai) {
            if (new Date(formData.tanggalMulai) > new Date(formData.tanggalSelesai)) {
                newErrors.tanggalSelesai = "Tanggal selesai harus setelah tanggal mulai";
                isValid = false;
            }
        }

        if (!formData.status) {
            newErrors.status = "Status harus dipilih";
            isValid = false;
        }

        // Validasi nilai hanya jika status Selesai
        if (formData.status === "selesai") {
            if (!formData.nilaiAkhir) {
                newErrors.nilaiAkhir = "Nilai akhir harus diisi";
                isValid = false;
            } else {
                const nilai = parseFloat(formData.nilaiAkhir);
                if (isNaN(nilai) || nilai < 0 || nilai > 100) {
                    newErrors.nilaiAkhir = "Nilai harus antara 0-100";
                    isValid = false;
                }
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validate()) return;

        setIsLoading(true);
        
        // Simulasi API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        onSubmit(formData);
        setIsLoading(false);
        handleClose();
    };

    const handleClose = () => {
        if (!isLoading) {
            setFormData({
                tanggalMulai: "",
                tanggalSelesai: "",
                status: "",
                nilaiAkhir: ""
            });
            setErrors({
                tanggalMulai: "",
                tanggalSelesai: "",
                status: "",
                nilaiAkhir: ""
            });
            onClose();
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const isStatusSelesai = formData.status === "selesai";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/30">
            {/* Overlay */}
            <div 
                className="absolute inset-0"
                onClick={handleClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-lg z-10">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Edit Data Siswa Magang</h3>
                                <p className="text-sm text-gray-500 mt-1">Perbarui informasi data magang siswa</p>
                            </div>
                            <button
                                onClick={handleClose}
                                disabled={isLoading}
                                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
                    {/* Periode & Status Section */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="text-cyan-500" size={20} />
                            Periode & Status
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Tanggal Mulai */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tanggal Mulai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.tanggalMulai}
                                    onChange={(e) => handleChange("tanggalMulai", e.target.value)}
                                    disabled={isLoading}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 ${
                                        errors.tanggalMulai 
                                            ? "border-red-500 focus:ring-red-200" 
                                            : "border-gray-300 focus:ring-cyan-200 focus:border-cyan-500"
                                    }`}
                                />
                                {errors.tanggalMulai && (
                                    <p className="mt-1 text-sm text-red-500">{errors.tanggalMulai}</p>
                                )}
                            </div>

                            {/* Tanggal Selesai */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tanggal Selesai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.tanggalSelesai}
                                    onChange={(e) => handleChange("tanggalSelesai", e.target.value)}
                                    disabled={isLoading}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 ${
                                        errors.tanggalSelesai 
                                            ? "border-red-500 focus:ring-red-200" 
                                            : "border-gray-300 focus:ring-cyan-200 focus:border-cyan-500"
                                    }`}
                                />
                                {errors.tanggalSelesai && (
                                    <p className="mt-1 text-sm text-red-500">{errors.tanggalSelesai}</p>
                                )}
                            </div>

                            {/* Status */}
                            <FormSelect
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={(value) => handleChange("status", value)}
                                options={statusOptions}
                                placeholder="Pilih Status"
                                error={errors.status}
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>

                    {/* Penilaian Section */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CheckCircle className="text-cyan-500" size={20} />
                            Penilaian
                        </h4>
                        
                        {!isStatusSelesai ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-amber-800">Hanya bisa diisi jika status selesai</p>
                                    <p className="text-xs text-amber-700 mt-1">
                                        Nilai hanya dapat diisi setelah status magang selesai
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <FormInput
                                label="Nilai Akhir"
                                name="nilaiAkhir"
                                type="number"
                                value={formData.nilaiAkhir}
                                onChange={(value) => handleChange("nilaiAkhir", value)}
                                placeholder="Masukkan nilai (0-100)"
                                error={errors.nilaiAkhir}
                                disabled={isLoading}
                                required
                            />
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-lg">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-400 to-sky-700 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={18} />
                                    Update
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}