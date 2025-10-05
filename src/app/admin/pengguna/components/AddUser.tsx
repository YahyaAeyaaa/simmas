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
        confirmPassword: string;
        role: string;
        emailVerification: string;
    }) => void;
}

export default function ModalAddUser({ isOpen, onClose, onSubmit }: ModalAddUserProps) {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        emailVerification: ""
    });
    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        emailVerification: ""
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
            emailVerification: ""
        };
        let isValid = true;

        if (!formData.username.trim()) {
            newErrors.username = "Username wajib diisi";
            isValid = false;
        } else if (formData.username.length < 3) {
            newErrors.username = "Username minimal 3 karakter";
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

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        
        try {
            // Call parent onSubmit which will handle API call
            await onSubmit(formData);
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
                emailVerification: ""
            });
            setErrors({ 
                username: "", 
                email: "", 
                password: "", 
                confirmPassword: "",
                role: "",
                emailVerification: ""
            });
            onClose();
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/30">
            {/* Overlay */}
            <div 
                className="absolute inset-0"
                onClick={handleClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-200 rounded-t-lg z-10">
                    <h3 className="text-lg font-semibold text-gray-900">Tambah User Baru</h3>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-4">
                    <div className="space-y-4">
                        {/* Username Field */}
                        <FormInput
                            label="Username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={(value) => handleChange("username", value)}
                            placeholder="Masukkan username"
                            icon={User}
                            error={errors.username}
                            disabled={isLoading}
                            required
                        />

                        {/* Email Field */}
                        <FormInput
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={(value) => handleChange("email", value)}
                            placeholder="user@example.com"
                            icon={Mail}
                            error={errors.email}
                            disabled={isLoading}
                            required
                        />

                        {/* Role Field */}
                        <FormSelect
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={(value) => handleChange("role", value)}
                            options={[
                                { value: "guru", label: "Guru" },
                                { value: "siswa", label: "Siswa" },
                                { value: "admin", label: "Admin" }
                            ]}
                            placeholder="Pilih Role"
                            icon={UserCircle}
                            error={errors.role}
                            disabled={isLoading}
                            required
                        />

                        {/* Email Verification Status */}
                        <FormSelect
                            label="Status Verifikasi Email"
                            name="emailVerification"
                            value={formData.emailVerification}
                            onChange={(value) => handleChange("emailVerification", value)}
                            options={[
                                { value: "verified", label: "Verified" },
                                { value: "unverified", label: "Unverified" }
                            ]}
                            placeholder="Pilih Status"
                            icon={Shield}
                            error={errors.emailVerification}
                            disabled={isLoading}
                            required
                        />

                        {/* Password Field */}
                        <FormPassword
                            label="Password"
                            name="password"
                            value={formData.password}
                            onChange={(value) => handleChange("password", value)}
                            placeholder="Minimal 6 karakter"
                            icon={Lock}
                            error={errors.password}
                            disabled={isLoading}
                            required
                        />

                        {/* Confirm Password Field */}
                        <FormPassword
                            label="Konfirmasi Password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(value) => handleChange("confirmPassword", value)}
                            placeholder="Ulangi password"
                            icon={Lock}
                            error={errors.confirmPassword}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-400 to-sky-700 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                "Tambah User"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}