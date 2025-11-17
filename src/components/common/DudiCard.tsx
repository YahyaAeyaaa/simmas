import { Building2, MapPin, Phone } from 'lucide-react';

interface DudiCardProps {
  companyName: string;
  address: string;
  phone: string;
  studentCount: number;
}

const DudiCard = ({ companyName, address, phone, studentCount }: DudiCardProps) => {
  return (
    <>
    <div className='flex justify-between items-start my-3'>
      <div className='text-sm space-y-2'>
        <p className='font-bold text-gray-800'>{companyName}</p>
        <div className='flex items-start gap-2 text-gray-600'>
          <MapPin size={16} className='mt-0.5 flex-shrink-0'/>
          <p>{address}</p>
        </div>
        <div className='flex items-center gap-2 text-gray-600'>
          <Phone size={16} className='flex-shrink-0'/>
          <p>{phone}</p>
        </div>
      </div>
      <div className='rounded-xl px-3 py-2 bg-[#A5A738] text-white text-sm font-medium'>
        <p>{studentCount} siswa</p>
      </div>
    </div>
    <hr className='bg-slate-200 text-slate-200'/>
    </>
  );
};

export default DudiCard;