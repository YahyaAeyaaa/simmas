import { GraduationCap, Calendar } from 'lucide-react';
import { getStatus, Status } from '@/helper/status';

interface MagangCardProps {
  studentName: string;
  companyName: string;
  startDate: string;
  endDate: string;
  status: Status;
}

const MagangCard = ({ studentName, companyName, startDate, endDate, status }: MagangCardProps) => {
  const statusConfig = getStatus(status);

  return (
    <div className='border border-gray-200 rounded-lg bg-gray-100 flex justify-between items-start p-4'>
      <div className='flex items-start gap-3.5'>
        <div className='bg-[#970747] p-2 rounded-xl'>
          <GraduationCap className='text-white' size={20}/>
        </div>
        <div className='text-sm'>
          <p className='mb-2 font-bold'>{studentName}</p>
          <p className='mb-2 text-gray-600'>{companyName}</p>
          <div className='flex items-center gap-2 text-gray-600'>
            <Calendar size={16}/>
            <p>{startDate} - {endDate}</p>
          </div>
        </div>
      </div>
      <div>
        <button className={`px-3 py-1.5 rounded-lg ${statusConfig.bgColor} ${statusConfig.textColor} text-sm font-medium`}>
          {statusConfig.label}
        </button>
      </div>
    </div>
  );
};

export default MagangCard;