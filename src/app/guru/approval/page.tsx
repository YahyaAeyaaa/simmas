"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toasts } from "@/components/modal/Toast";

export default function Approval() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const pendingMagang = [
        {
            id: "1",
            siswaId: "101",
            siswa: {
                nama: "Ahmad Fauzi",
                nis: "1234567890",
                kelas: "XII",
                jurusan: "Rekayasa Perangkat Lunak"
            },
            dudi: {
                namaPerusahaan: "PT Teknologi Maju"
            },
            status: "pending",
            createdAt: "2023-10-15T07:00:00.000Z"
        },
        {
            id: "2",
            siswaId: "102",
            siswa: {
                nama: "Siti Nurhaliza",
                nis: "0987654321",
                kelas: "XII",
                jurusan: "Teknik Komputer dan Jaringan"
            },
            dudi: {
                namaPerusahaan: "CV Digital Solution"
            },
            status: "pending",
            createdAt: "2023-10-16T08:30:00.000Z"
        },
        {
            id: "3",
            siswaId: "103",
            siswa: {
                nama: "Budi Santoso",
                nis: "5678901234",
                kelas: "XI",
                jurusan: "Multimedia"
            },
            dudi: {
                namaPerusahaan: "PT Creative Design"
            },
            status: "diterima",
            createdAt: "2023-10-14T09:15:00.000Z"
        },
        {
            id: "4",
            siswaId: "104",
            siswa: {
                nama: "Dewi Lestari",
                nis: "4321098765",
                kelas: "XII",
                jurusan: "Rekayasa Perangkat Lunak"
            },
            dudi: {
                namaPerusahaan: "PT Software Indonesia"
            },
            status: "ditolak",
            createdAt: "2023-10-13T10:45:00.000Z"
        }
    ];


    return (
        <>
            <div className="overflow-hidden bg-gray-50 p-6 min-h-screen">
                <h1 className="text-xl font-semibold mb-6">Persetujuan Pengajuan Magang</h1>
                
                <div className="bg-white rounded-lg shadow p-4">
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : pendingMagang.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Tidak ada pengajuan magang yang menunggu persetujuan
                        </div>
                    ) : (
                        <div className="">
                            <table className="w-10">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jurusan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perusahaan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Pengajuan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pendingMagang.map((magang) => (
                                        <tr key={magang.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{magang.siswa.nama}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{magang.siswa.kelas}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{magang.siswa.jurusan}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{magang.dudi.namaPerusahaan}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(magang.createdAt).toLocaleDateString('id-ID')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    magang.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                                                    magang.status === "diterima" ? "bg-green-100 text-green-800" : 
                                                    "bg-red-100 text-red-800"
                                                }`}>
                                                    {magang.status === "pending" ? "Menunggu" : 
                                                    magang.status === "diterima" ? "Disetujui" : 
                                                    "Ditolak"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    {magang.status === "pending" && (
                                                        <>
                                                            <button 
                                                                className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded text-sm"
                                                            >
                                                                Setujui
                                                            </button>
                                                            <button 
                                                                className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-sm"
                                                            >
                                                                Tolak
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}