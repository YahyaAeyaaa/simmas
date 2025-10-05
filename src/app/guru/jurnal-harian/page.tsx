"use client";

import Card from '@/components/common/Card'
import { Building2 , CircleX , CircleCheckBig , Users , Phone , MapPin , Mail , Building, Eye  } from 'lucide-react'
import { getLogbookStatus , logbookDummyData } from '@/helper/LogBookHelper';

export default function Jurnal () {
    return (
        <>
            <div className="my-6 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card 
            title="Total Dudi"
            total={6}
            icon={<Building2 className='text-[#970747]'/>}
            subtitle="Prusahaan mitra aktif"
        />
        <Card 
            title="Total Siswa Magang"
            total={45}
            icon={<Users  className='text-[#970747]'/>}
            subtitle="Siswa Magang Aktif"
        />
        <Card 
            title="Rata-Rata siswa"
            total={9}
            icon={<Building className='text-[#970747]'/>}
            subtitle="Per Perusahaan"
        />
            </div>
        </div>
        <div className='w-full h-auto rounded-lg shadow-lg bg-white p-6'>
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-2'>
                    <Building2 className='text-[#970747]' size={24} />
                    <h2 className='text-xl font-semibold'>Daftar DUDI</h2>
                </div>
                <button className='bg-[#970747] text-white px-4 py-2 rounded-lg flex items-center gap-2'>
                    + Tambah DUDI
                </button>
            </div>

            <input 
                type="text" 
                placeholder="Cari perusahaan, alamat, penanggungjawab..." 
                className='w-100 border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500'
            />

            <div className='overflow-x-auto'>
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='text-left py-3 px-4 font-medium text-gray-600'>Siswa & Tanggal</th>
                            <th className='text-left py-3 px-4 font-medium text-gray-600 w-100'>Kegiatan & Kendala</th>
                            <th className='text-left py-3 px-4 font-medium text-gray-600'>Status</th>
                            <th className='text-left py-3 px-4 font-medium text-gray-600'>Catatan Guru</th>
                            <th className='text-left py-3 px-4 font-medium text-gray-600'>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logbookDummyData.map((dudi) => {
                            const statusInfo = getLogbookStatus(dudi.status);
                            return (
                                <tr key={dudi.id} className='hover:bg-gray-50'>
                                    <td className='py-4 px-4'>
                                                <div className='font-medium'>{dudi.siswaName}</div>
                                                <div className='text-sm text-gray-500'>
                                                    <p>{dudi.kelas}</p>
                                                    <p>{dudi.tanggal}</p>
                                                </div>
                                    </td>
                                    <td className='py-4 px-4'>
                                        <div className='text-sm text-gray-600'>
                                            <p className='font-semibold'>Kegiatan :</p>
                                            {dudi.kegiatan}
                                            <p className='font-semibold'>Kendala :</p>
                                            {dudi.kendala}
                                        </div>
                                    </td>
                                    <td className='py-4 px-4'>
                                        <div className='flex items-center gap-2'>
                                            <span className={`${statusInfo.bgColor} ${statusInfo.textColor} px-2.5 py-1 rounded-full text-xs font-medium`}>
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                    </td>
                                        <td className=''>
                                        <div className=''>
                                            {dudi.catatanGuru}
                                        </div>
                                    </td>
                                    <td>
                                        <div className='flex justify-center gap-2 text-gray-600'>
                                            <Eye className='hover:text-green-500 transition-all duration-150' />
                                        </div>
                                    </td>
                                    
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    )
}