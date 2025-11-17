// File: components/common/MagangCard.tsx
import { CheckCircle, Eye, MapPin, User , Send  } from "lucide-react";

interface MagangCardProps {
    data: {
        id: number;
        nama: string;
        bidang: string;
        alamat: string;
        pic: string;
        kuotaMagang: string;
        slotTerisi: number;
        slotTotal: number;
        deskripsi: string;
        sudahDaftar: boolean;
        badge: string;
    };
    onDetail: () => void;
    onDaftar: () => void;
}

export default function MagangCard({ data, onDetail, onDaftar }: MagangCardProps) {
    const progressPercentage = (data.slotTerisi / data.slotTotal) * 100;
    
    return (
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
            {/* Header Card */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-cyan-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {data.nama.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{data.nama}</h3>
                        <p className="text-sm text-cyan-600">{data.bidang}</p>
                    </div>
                </div>
                {data.badge && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                        {data.badge}
                    </span>
                )}
            </div>

            {/* Info Section */}
            <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
                    <span>{data.alamat}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User size={16} className="flex-shrink-0 text-gray-400" />
                    <span>PIC: {data.pic}</span>
                </div>
            </div>

            {/* Kuota Magang */}
            <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Kuota Magang</span>
                    <span className="font-semibold text-gray-900">{data.kuotaMagang}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                        className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">{data.slotTerisi} slot terisi</p>
            </div>

            {/* Deskripsi */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {data.deskripsi}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={onDetail}
                    className="flex-shrink-0 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                    <Eye size={16} />
                    Lihat Detail
                </button>
                <button
                    onClick={onDaftar}
                    disabled={data.sudahDaftar}
                    className={`flex-1 px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2 ${
                        data.sudahDaftar 
                            ? 'bg-gray-400 text-white cursor-not-allowed' 
                            : 'bg-cyan-500 text-white hover:bg-cyan-600'
                    }`}
                >
                    {data.sudahDaftar ? (
                        <>
                            <CheckCircle size={16} />
                            {data.badge && data.badge.toLowerCase().includes('menunggu') ? 'Menunggu' : 'Sudah Daftar'}
                        </>
                    ) : (
                        <>
                        <Send size={16} />
                        Daftar
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}