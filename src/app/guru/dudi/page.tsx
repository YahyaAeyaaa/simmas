"use client";

import Card from '@/components/common/Card'
import { Building2 , CircleX , CircleCheckBig , Users , Phone , MapPin , Mail , Building  } from 'lucide-react'
import { dudiDummyData, getStatus } from '@/helper/status'
import ActionButton from '@/components/common/ActionButton'
import DeleteModal from '@/components/modal/ModalDelete';

export default function Dudi () {
    return (
        <>
        <div className='bg-gray-50 p-6 min-h-screen'>
            <div className='my-4'>
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
                            <th className='text-left py-3 px-4 font-medium text-gray-600'>Perusahaan</th>
                            <th className='text-left py-3 px-4 font-medium text-gray-600'>Kontak</th>
                            <th className='text-left py-3 px-4 font-medium text-gray-600'>Penanggung Jawab</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dudiDummyData.map((dudi) => {
                            const statusInfo = getStatus(dudi.status);
                            return (
                                <tr key={dudi.id} className='hover:bg-gray-50'>
                                    <td className='py-4 px-4'>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-10 h-10 bg-[#970747] rounded flex items-center justify-center text-white font-bold'>
                                                <Building2 />
                                            </div>
                                            <div>
                                                <div className='font-medium'>{dudi.namaPerusahaan}</div>
                                                <div className='text-sm text-gray-500 flex items-center gap-1'>
                                                    <MapPin size={15}/>
                                                    {dudi.alamat}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-4 px-4'>
                                        <div className='text-sm text-gray-600'>
                                            <div className='flex items-center gap-1'>
                                                <Mail size={15} />
                                                {dudi.email}</div>
                                            <div className='flex items-center gap-1'>
                                                <Phone size={15}/> 
                                                {dudi.telepon}
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-4 px-4'>
                                        <div className='flex items-center gap-2'>
                                            <div className='flex items-center justify-center w-8 h-8 rounded-full bg-gray-200'>
                                                <Users size={16} className='text-gray-400' />
                                            </div>
                                            <span>{dudi.penanggungJawab}</span>
                                        </div>
                                    </td>
                                    
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
        </>
    )
}