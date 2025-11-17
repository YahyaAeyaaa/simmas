// app/admin/pengguna/components/AddUser.tsx
"use client";

import { useState } from "react";
import { X, User, Mail, Lock, UserCircle, Shield } from "lucide-react";
import FormInput from "@/components/common/FormInput";
import FormSelect from "@/components/common/FormSelect";
import FormPassword from "@/components/common/FormPassword";

interface ModalAddUserProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { 
    username: string; 
    email: string; 
    password: string;
    confirmPassword?: string;
    role: string;
    emailVerification: string;
    jurusan?: string;
    kelas?: 'XI' | 'XII' | string;
    nis?: number | null;
    nip?: string;
  }) => void;
}

export default function ModalAddUser({ isOpen, onClose, onSubmit }: ModalAddUserProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    emailVerification: "" ,
    jurusan: "",
    kelas: "",
    nis: "",
    nip: ""
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    emailVerification: "",
    jurusan: "",
    kelas: "",
    nis: "",
    nip: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      emailVerification: "",
      jurusan: "",
      kelas: "",
      nis: "",
      nip: ""
    };
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = "Nama wajib diisi";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "Nama minimal 3 karakter";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
      isValid = false;
    }

    if (!formData.role) {
      newErrors.role = "Role wajib dipilih";
      isValid = false;
    }

    if (!formData.emailVerification) {
      newErrors.emailVerification = "Status verifikasi wajib dipilih";
      isValid = false;
    }

    if (formData.role === "siswa") {
      if (!formData.nis.trim()) {
        newErrors.nis = "NIS wajib diisi";
        isValid = false;
      }
      if (!formData.jurusan.trim()) {
        newErrors.jurusan = "Jurusan wajib diisi";
        isValid = false;
      }
      if (!formData.kelas.trim()) {
        newErrors.kelas = "Kelas wajib dipilih";
        isValid = false;
      }
    }

    if (formData.role === "guru") {
      if (!formData.nip.trim()) {
        newErrors.nip = "NIP wajib diisi";
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
      await onSubmit({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
        emailVerification: formData.emailVerification,
        jurusan: formData.role === "siswa" ? formData.jurusan : undefined,
        kelas: formData.role === "siswa" ? (formData.kelas as 'XI' | 'XII') : undefined,
        nis: formData.role === "siswa" ? formData.nis : undefined,
        nip: formData.role === "guru" ? formData.nip : undefined
      });
      // keep modal open/closing handled by parent
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        emailVerification: "" ,
        jurusan: "",
        kelas: "",
        nis: "",
        nip: ""
      });
      setErrors({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        emailVerification: "",
        jurusan: "",
        kelas: "",
        nis: "",
        nip: ""
      });
      onClose();
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      // clear role-specific fields when role changes
      if (field === 'role') {
        const role = value;
        return {
          ...prev,
          role,
          // clear fields if switching away
          jurusan: role === 'siswa' ? prev.jurusan : '',
          kelas: role === 'siswa' ? prev.kelas : '',
          nis: role === 'siswa' ? prev.nis : '',
          nip: role === 'guru' ? prev.nip : ''
        };
      }
      return { ...prev, [field]: value };
    });
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (field === 'role') {
      setErrors(prev => ({ ...prev, jurusan: "", kelas: "", nis: "", nip: "" }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/30">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-200 rounded-t-lg z-10">
          <h3 className="text-lg font-semibold text-gray-900">Tambah User Baru</h3>
          <button onClick={handleClose} disabled={isLoading} className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="space-y-4">
            <FormInput label="Nama" name="username" type="text" value={formData.username} onChange={(v) => handleChange("username", v)} placeholder="Masukkan nama" icon={User} error={errors.username} disabled={isLoading} required />

            <FormInput label="Email" name="email" type="email" value={formData.email} onChange={(v) => handleChange("email", v)} placeholder="user@example.com" icon={Mail} error={errors.email} disabled={isLoading} required />

            <FormSelect label="Role" name="role" value={formData.role} onChange={(v) => handleChange("role", v)} options={[
              { value: "guru", label: "Guru" },
              { value: "siswa", label: "Siswa" },
              { value: "admin", label: "Admin" }
            ]} placeholder="Pilih Role" icon={UserCircle} error={errors.role} disabled={isLoading} required />

            {/* Conditional: NIS for siswa */}
            {formData.role === "siswa" && (
              <>
                <FormInput label="NIS" name="nis" type="number" value={formData.nis} onChange={(v) => handleChange("nis", v)} placeholder="Masukkan NIS" icon={User} error={errors.nis} disabled={isLoading} required />
                <FormInput label="Jurusan" name="jurusan" type="text" value={formData.jurusan} onChange={(v) => handleChange("jurusan", v)} placeholder="Mis. RPL" icon={User} error={errors.jurusan} disabled={isLoading} required />
                <FormSelect label="Kelas" name="kelas" value={formData.kelas} onChange={(v) => handleChange("kelas", v)} options={[
                  { value: "XI", label: "XI (Kelas 11)" },
                  { value: "XII", label: "XII (Kelas 12)" }
                ]} placeholder="Pilih Kelas" icon={UserCircle} error={errors.kelas} disabled={isLoading} required />
              </>
            )}

            {/* Conditional: NIP for guru */}
            {formData.role === "guru" && (
              <FormInput label="NIP" name="nip" type="text" value={formData.nip} onChange={(v) => handleChange("nip", v)} placeholder="Masukkan NIP" icon={User} error={errors.nip} disabled={isLoading} required />
            )}

            <FormSelect label="Status Verifikasi Email" name="emailVerification" value={formData.emailVerification} onChange={(v) => handleChange("emailVerification", v)} options={[
              { value: "verified", label: "Verified" },
              { value: "unverified", label: "Unverified" }
            ]} placeholder="Pilih Status" icon={Shield} error={errors.emailVerification} disabled={isLoading} required />

            <FormPassword label="Password" name="password" value={formData.password} onChange={(v) => handleChange("password", v)} placeholder="Minimal 6 karakter" icon={Lock} error={errors.password} disabled={isLoading} required />
            <FormPassword label="Konfirmasi Password" name="confirmPassword" value={formData.confirmPassword} onChange={(v) => handleChange("confirmPassword", v)} placeholder="Ulangi password" icon={Lock} error={errors.confirmPassword} disabled={isLoading} required />
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
            <button type="button" onClick={handleClose} disabled={isLoading} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">Batal</button>
            <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-400 to-sky-700 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
              {isLoading ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Menyimpan...</>) : ("Tambah User")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
