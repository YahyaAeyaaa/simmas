
import { GraduationCap, Menu } from 'lucide-react';
import { useSchoolSettings } from '@/app/context/SchoolSettingsContext';

interface NavbarProps {
  onMenuClick?: () => void;
  userName?: string;
  userRole?: string;
}

const Navbar = ({ 
  onMenuClick, 
  userName = "Nama User", 
  userRole = "Admin" 
}: NavbarProps) => {
  const { schoolSettings } = useSchoolSettings();
  
  const schoolName = schoolSettings?.namaSekolah || "SMK Negeri 1 Surabaya";
  return (
    <div className="w-full bg-white shadow-sm flex items-center justify-between px-4 py-3 sticky top-0 z-30">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="xl:hidden p-2 rounded-lg hover:bg-gray-100 mr-3"
      >
        <Menu className="w-6 h-6 text-gray-600" />
      </button>

      {/* Logo & Title */}
      <div className="flex items-center justify-between flex-1 xl:flex-initial xl:w-auto gap-6">
        <div className="flex items-center gap-3">
          <div className=" bg-[#970747] px-2 py-2 rounded-2xl">
            <GraduationCap className="text-white" />
          </div>
          <div className="font-semibold text-[#970747]">SIMMAS</div>
        </div>
        
        <div className="hidden md:block">
          <div className="font-semibold text-[#970747]">{schoolName}</div>
          <p className="text-sm text-gray-600">Sistem Manajemen Magang Siswa</p>
        </div>
      </div>

      {/* User Info */}
      <div className="hidden sm:flex items-center gap-2 ml-auto">
        <div className=" bg-[#970747] px-2 py-2 rounded-2xl">
          <GraduationCap className="text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#970747]">{userName}</p>
          <p className="text-xs text-gray-500">{userRole}</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;