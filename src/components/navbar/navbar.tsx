'use client';

import { GraduationCap, Menu, User, LogOut, ChevronDown } from 'lucide-react';
import { useSchoolSettings } from '@/app/context/SchoolSettingsContext';
import { useState, useRef, useEffect } from 'react';
import ProfileModal from '@/components/modal/ProfileModal';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: userName,
    email: '',
    role: userRole.toLowerCase(),
    avatar: ''
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const schoolName = schoolSettings?.namaSekolah || "SMK Negeri 1 Surabaya";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch user data when profile modal opens
  useEffect(() => {
    const fetchUserData = async () => {
      if (isProfileModalOpen) {
        try {
          const response = await fetch('/api/profile');
          const data = await response.json();
          
          if (data.success) {
            setUserData({
              name: data.data.name,
              email: data.data.email,
              role: data.data.role,
              avatar: data.data.avatar || ''
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [isProfileModalOpen]);

  const handleLogout = async () => {
    try {
      // Panggil API logout untuk hapus cookie di server
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });

      if (response.ok) {
        // Redirect ke login dan refresh window
        window.location.href = '/auth/login';
      } else {
        console.error('Logout failed');
        // Tetap redirect meskipun logout API gagal
        window.location.href = '/auth/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Tetap redirect meskipun ada error
      window.location.href = '/auth/login';
    }
  };

  const handleProfile = () => {
    setIsProfileModalOpen(true);
    setIsDropdownOpen(false);
  };

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
          <div className=" bg-cyan-500 px-2 py-2 rounded-2xl">
            <GraduationCap className="text-white" />
          </div>
          <div className="font-semibold text-cyan-500">SIMMAS</div>
        </div>
        
        <div className="hidden md:block">
          <div className="font-semibold text-gray-600">{schoolName}</div>
          <p className="text-sm text-gray-600">Sistem Manajemen Magang Siswa</p>
        </div>
      </div>

      {/* User Info with Dropdown */}
      <div className="hidden sm:flex items-center gap-2 ml-auto relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
        >
          {/* Avatar Circle */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-cyan-600 to-sky-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
            {userData.avatar ? (
              <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</span>
            )}
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-cyan-500">{userName}</p>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <button
              onClick={handleProfile}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
            >
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700">My Profile</span>
            </button>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-600">Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userData={userData}
      />
    </div>
  );
};

export default Navbar;