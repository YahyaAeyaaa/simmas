import DashboardLayout from '@/app/layout/layout';
import HeaderCard from '@/components/common/headerCard';
import { Users } from 'lucide-react';

export default function Dashboard () {
    return (
        <>
        <div>
            <HeaderCard 
                title="Dashboard Admin"
                subtitle="Selamat datang kembali!"
                icon={<Users className="w-8 h-8 text-white" />}
            />
            <p>
                Hallo siswa
            </p>
        </div>
        </>
    )
}