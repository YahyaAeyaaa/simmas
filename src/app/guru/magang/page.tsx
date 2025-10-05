"use client";

import React from 'react'
import Card from '@/components/common/Card'
import { CircleCheckBig , GraduationCap, Users , Calendar   } from 'lucide-react'
import { dudiDummyData, getStatus } from '@/helper/MagangHelper'
import ActionButton from '@/components/common/ActionButton'
import { Eye } from 'lucide-react';

export default function pengguna () {
    return (
        <>
            <p className="text-2xl font-semibold font-family-plus-jakarta">Manajemen Siswa Magang</p>
            <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card 
                    title="Total Siswa"
                    total={6}  // tanpa kutip
                    icon={<Users className='text-[#970747]'/>}
                    subtitle="Seluruh Siswa Terdaftar"
                />
                <Card 
                    title="Total Dudi"
                    total={3}  // tanpa kutip
                    icon={<GraduationCap  className='text-[#970747]'/>}
                    subtitle="Perusahaan Partner"
                />
                <Card 
                    title="Magang Aktif"
                    total={2}  // tanpa kutip
                    icon={<CircleCheckBig  className='text-[#970747]'/>}
                    subtitle="Sedang Magang"
                />
                <Card 
                    title="Logbook Pending"
                    total={1}  // tanpa kutip
                    icon={<Calendar  className='text-[#970747]'/>}
                    subtitle="Menunggu Verifikasi"
                />
                </div>
            </div>
                    <div className='mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead>
                            <tr>
                                <th className='text-left py-3 px-4 font-medium text-sm'>Nama Siswa</th>
                                <th className='text-left py-3 px-4 font-medium text-sm'>Guru Pembimbing</th>
                                <th className='text-left py-3 px-4 font-medium text-sm'>Dudi</th>
                                <th className='text-left py-3 px-4 font-medium text-sm'>Periode</th>
                                <th className='text-left py-3 px-4 font-medium text-sm'>Status</th>
                                <th className='text-left py-3 px-4 font-medium text-sm'>Nilai</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200'>
                            {dudiDummyData.map((dudi) => {
                                const statusInfo = getStatus(dudi.status);

                                return (
                                    <tr key={dudi.id} className='hover:bg-gray-50'>
                                        <td className='py-3 px-4'>
                                            <div className='font-medium text-gray-900'>{dudi.Siswa}</div>
                                            <div className='text-sm text-gray-500'>NIS: {dudi.NIS}</div>
                                            <div className='text-sm text-gray-500'>{dudi.kelas}</div>
                                            <div className='text-sm text-gray-500'>{dudi.jurursan}</div>
                                        </td>
                                        <td className='py-3 px-4'>
                                            <div className='font-medium text-gray-900'>{dudi.GuruPembimbing}</div>
                                            <div className='text-sm text-gray-500'>NIP: {dudi.NIP}</div>
                                        </td>
                                        <td className='py-3 px-4'>
                                            <div className='font-medium text-gray-900'>{dudi.dudi}</div>
                                            <div className='text-sm text-gray-500'>{dudi.lokasi}</div>
                                            <div className='text-sm text-gray-500'>{dudi.pemilik}</div>
                                        </td>
                                        <td className='py-3 px-4 text-sm text-gray-700'>
                                            {dudi.periode_awal} s.d {dudi.periode_akhir}
                                        </td>
                                        <td className='py-3 px-4'>
                                            <span className={`${statusInfo.bgColor} ${statusInfo.textColor} px-2.5 py-1 rounded-full text-xs font-medium`}>
                                                {statusInfo.label}
                                            </span>
                                        </td>
                                        <td className='py-3 px-4'>
                                            <span className='font-semibold text-gray-900'>{dudi.Nilai}</span>
                                        </td>
                                        <td className='py-3 px-4'>
                                            <div className='flex justify-center gap-2 text-gray-600'>
                                                <Eye />
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