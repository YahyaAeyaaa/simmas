// File: components/modal/ModalDetailTempatMagang.tsx
"use client";

import { X, MapPin, Phone, Mail, User, GraduationCap } from "lucide-react";

interface ModalDetailTempatMagangProps {
    isOpen: boolean;
    onClose: () => void;
    onDaftar: () => void;
    data: {
        nama: string;
        bidang: string;
        deskripsi: string;
        alamat: string;
        telepon: string;
        email: string;
        penanggungJawab: string;
        kuotaMagang: string;
        slotTerisi: number;
        slotTotal: number;
        sudahDaftar: boolean;
        guruPenanggungJawab?: {
            nama: string;
            nip: string;
        } | null;
    };
}

export default function ModalDetailTempatMagang({ 
    isOpen, 
    onClose, 
    onDaftar,
    data 
}: ModalDetailTempatMagangProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/30">
            {/* Overlay */}
            <div 
                className="absolute inset-0"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-lg z-10">
                    <div className="flex items-start gap-4 px-6 py-4">
                        <div className="w-16 h-16 rounded-lg bg-cyan-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                            {data.nama.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">{data.nama}</h3>
                            <p className="text-sm text-cyan-600">{data.bidang}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6 space-y-6 bg-slate-100">
                    {/* Tentang Perusahaan */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Tentang Perusahaan</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {data.deskripsi}
                        </p>
                    </div>

                    {/* Informasi Kontak */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Informasi Kontak</h4>
                        <div className="space-y-3">
                            <div className="flex items-start gap-2 text-sm bg-white p-2 rounded-xl">
                                <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-500 text-xs mb-0.5">Alamat</p>
                                    <p className="text-gray-700">{data.alamat}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="flex items-start gap-2 text-sm bg-white p-2 rounded-xl">
                                    <Phone size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-gray-500 text-xs mb-0.5">Telepon</p>
                                        <p className="text-gray-700">{data.telepon}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 text-sm bg-white p-2 rounded-xl">
                                    <Mail size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-gray-500 text-xs mb-0.5">Email</p>
                                        <p className="text-gray-700">{data.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 text-sm bg-white p-2 rounded-xl">
                                <User size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-500 text-xs mb-0.5">Penanggung Jawab</p>
                                    <p className="text-gray-700">{data.penanggungJawab}</p>
                                </div>
                            </div>

                            {data.guruPenanggungJawab && (
                                <div className="flex items-start gap-2 text-sm bg-green-50 p-2 rounded-xl border border-green-200">
                                    <GraduationCap size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-green-700 text-xs mb-0.5 font-medium">Guru Penanggung Jawab</p>
                                        <p className="text-green-800 font-semibold">{data.guruPenanggungJawab.nama}</p>
                                        <p className="text-green-600 text-xs">NIP: {data.guruPenanggungJawab.nip}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Informasi Magang */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Informasi Magang</h4>
                        <div className="bg-gradient-to-r from-cyan-50 to-sky-100 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Bidang Usaha</span>
                                <span className="font-semibold text-gray-900">{data.bidang}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Kuota Magang</span>
                                <span className="font-semibold text-gray-900">{data.kuotaMagang}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Slot Tersisa</span>
                                <span className="font-semibold text-cyan-600">
                                    {data.slotTotal - data.slotTerisi} slot
                                </span>
                            </div>
                            
                            {data.guruPenanggungJawab && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Guru Pembimbing</span>
                                    <span className="font-semibold text-green-600">
                                        Auto-assign ke {data.guruPenanggungJawab.nama}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-lg">
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Tutup
                        </button>
                        <button
                            onClick={onDaftar}
                            disabled={data.sudahDaftar}
                            className={`flex-1 px-4 py-2.5 rounded-lg transition-all font-medium ${
                                data.sudahDaftar 
                                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-cyan-400 to-sky-700 text-white hover:opacity-90'
                            }`}
                        >
                            {data.sudahDaftar ? 'Sudah Terdaftar' : 'Daftar Magang'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}