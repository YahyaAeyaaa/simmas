import { BookOpen, Calendar } from 'lucide-react';
import { getLogbookStatus, LogbookStatus } from '@/helper/status';

interface LogbookCardProps {
  name: string;
  date: string;
  issue?: string;
  status: LogbookStatus;
}

const LogbookCard = ({ name, date, issue, status }: LogbookCardProps) => {
  const statusConfig = getLogbookStatus(status) || {
    label: 'Unknown',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800'
  };

  return (
    <div className='border border-gray-200 rounded-lg bg-gray-100 flex justify-between items-start p-4 mb-3'>
      <div className='flex items-start gap-3.5'>
        <div className='bg-lime-500 p-2 rounded-xl'>
          <BookOpen className='text-white' size={20}/>  
        </div>
        <div className='text-sm'>
          <p className='mb-2 font-bold'>{name}</p>
          <p className='mb-2 text-gray-600 flex items-center gap-2'>
            <Calendar size={15}/> {date}
          </p>
          {issue && (
            <i className='text-[#ffc721]'>Kendala : {issue}</i>
          )}
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

export default LogbookCard;