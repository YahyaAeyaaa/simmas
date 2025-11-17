'use client';

import { X, User, Mail, Lock, Camera, Save } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import FormInput from '@/components/common/FormInput';
import FormPassword from '@/components/common/FormPassword';
import { Toasts } from '@/components/modal/Toast';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export default function ProfileModal({ isOpen, onClose, userData }: ProfileModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userData && isOpen) {
      setFormData({
        name: userData.name,
        email: userData.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        avatar: userData.avatar || ''
      });
      setAvatarPreview(userData.avatar || '');
    }
  }, [userData, isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setFormData({
      name: userData.name,
      email: userData.email,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      avatar: userData.avatar || ''
    });
    setErrors({
      name: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setAvatarPreview(userData.avatar || '');
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        Toasts('danger', 4000, 'Error', 'Ukuran file maksimal 2MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        Toasts('danger', 4000, 'Error', 'File harus berupa gambar');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    let isValid = true;

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Nama harus diisi';
      isValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
      isValid = false;
    }

    // Validate password change (if user wants to change password)
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Password lama harus diisi';
        isValid = false;
      }

      if (!formData.newPassword) {
        newErrors.newPassword = 'Password baru harus diisi';
        isValid = false;
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Password minimal 6 karakter';
        isValid = false;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Password tidak cocok';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar
      };

      // Only include password if user wants to change it
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (data.success) {
        Toasts('success', 3000, 'Berhasil!', 'Profile berhasil diupdate');
        
        // Refresh page to update navbar
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        Toasts('danger', 4000, 'Gagal!', data.error || 'Gagal update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Toasts('danger', 4000, 'Error', 'Gagal update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleLabel = (role: string) => {
    const roleMap: { [key: string]: string } = {
      admin: 'Administrator',
      guru: 'Guru',
      siswa: 'Siswa'
    };
    return roleMap[role] || role;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/30">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#970747] to-pink-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User size={24} />
            <div>
              <h2 className="text-xl font-bold">My Profile</h2>
              <p className="text-sm text-pink-50">Kelola informasi profil Anda</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#970747] to-pink-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{getInitials(formData.name)}</span>
                )}
              </div>
              <button
                type="button"
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 bg-[#970747] text-white p-3 rounded-full shadow-lg hover:bg-pink-700 transition-colors"
              >
                <Camera size={20} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-500 mt-3">Klik icon kamera untuk mengubah foto</p>
            <p className="text-xs text-gray-400 mt-1">Maksimal 2MB (JPG, PNG, GIF)</p>
          </div>

          {/* Role Badge */}
          <div className="flex justify-center mb-6">
            <span className="bg-[#970747] text-white px-4 py-2 rounded-full text-sm font-semibold">
              {getRoleLabel(userData.role)}
            </span>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <FormInput
              label="Nama Lengkap"
              name="name"
              value={formData.name}
              onChange={(value) => handleChange('name', value)}
              placeholder="Masukkan nama lengkap"
              icon={User}
              error={errors.name}
              disabled={isLoading}
              required
            />

            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(value) => handleChange('email', value)}
              placeholder="Masukkan email"
              icon={Mail}
              error={errors.email}
              disabled={isLoading}
              required
            />

            {/* Password Change Section */}
            <div className="border-t border-gray-200 pt-4 mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Lock size={18} />
                Ubah Password (Opsional)
              </h3>
              
              <div className="space-y-4">
                <FormPassword
                  label="Password Lama"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={(value) => handleChange('currentPassword', value)}
                  placeholder="Masukkan password lama"
                  error={errors.currentPassword}
                  disabled={isLoading}
                />

                <FormPassword
                  label="Password Baru"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={(value) => handleChange('newPassword', value)}
                  placeholder="Masukkan password baru"
                  error={errors.newPassword}
                  disabled={isLoading}
                />

                <FormPassword
                  label="Konfirmasi Password Baru"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(value) => handleChange('confirmPassword', value)}
                  placeholder="Konfirmasi password baru"
                  error={errors.confirmPassword}
                  disabled={isLoading}
                />
              </div>

              <p className="text-xs text-gray-500 mt-2 italic">
                * Kosongkan jika tidak ingin mengubah password
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-5 py-2.5 bg-gradient-to-r from-[#970747] to-pink-600 text-white rounded-lg hover:from-[#7d0639] hover:to-pink-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save size={18} />
            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}


