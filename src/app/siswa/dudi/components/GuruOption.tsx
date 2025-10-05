// File: components/modal/ModalPilihGuru.tsx
"use client";

import { useState } from "react";
import { X, UserCircle, Search } from "lucide-react";
import FormSelect from "@/components/common/FormSelect";

interface ModalPilihGuruProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (guruId: string) => void;
    dudiName: string;
}

// Dummy data guru - nanti diganti dengan API
const guruOptions = [
    { value: "1", label: "Pak Budi Santoso, S.Pd" },
    { value: "2", label: "Bu Siti Nurhaliza, S.Pd" },
    { value: "3", label: "Pak Ahmad Dhani, M.Pd" },
    { value: "4", label: "Bu Dewi Lestari, S.Pd" },
    { value: "5", label: "Pak Ridwan Kamil, M.Pd" }
];

export default function ModalPilihGuru({ 
    isOpen, 
    onClose, 
    onSubmit,
    dudiName 
}: ModalPilihGuruProps) {
    const [selectedGuru, setSelectedGuru] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedGuru) {
            setError("Pilih guru pembimbing terlebih dahulu");
            return;
        }

        setIsLoading(true);
        
        // Simulasi API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        onSubmit(selectedGuru);
        setIsLoading(false);
        handleClose();
    };

    const handleClose = () => {
        if (!isLoading) {
            setSelectedGuru("");
            setError("");
            onClose();
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
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Pilih Guru Pembimbing</h3>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="px-6 py-4">
                    {/* Info Perusahaan */}
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-cyan-800">
                            <span className="font-medium">Mendaftar ke:</span> {dudiName}
                        </p>
                    </div>

                    {/* Select Guru */}
                    <FormSelect
                        label="Guru Pembimbing"
                        name="guru"
                        value={selectedGuru}
                        onChange={(value) => {
                            setSelectedGuru(value);
                            setError("");
                        }}
                        options={guruOptions}
                        placeholder="Pilih guru pembimbing"
                        icon={UserCircle}
                        error={error}
                        disabled={isLoading}
                        required
                    />

                    {/* Info Text */}
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-800">
                            <span className="font-medium">Catatan:</span> Guru pembimbing akan memantau dan membimbing Anda selama proses magang berlangsung.
                        </p>
                    </div>

                    {/* Footer Buttons */}
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
                                    Memproses...
                                </>
                            ) : (
                                "Daftar Magang"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}