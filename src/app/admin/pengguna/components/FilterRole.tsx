"use client";

import { useState } from "react";
import { X, Filter, UserCircle, RotateCcw , Sparkles} from "lucide-react";
import FormSelect from "@/components/common/FormSelect";
import Button from "@/components/common/Button";

interface ModalFilterUserProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (role: string) => void;
    currentRole?: string;
}

export default function ModalFilterUser({ 
    isOpen, 
    onClose, 
    onApply,
    currentRole = ""
}: ModalFilterUserProps) {
    const [selectedRole, setSelectedRole] = useState(currentRole);

    if (!isOpen) return null;

    const roleOptions = [
        { value: "admin", label: "Admin" },
        { value: "guru", label: "Guru" },
        { value: "siswa", label: "Siswa" }
    ];

    const handleApply = () => {
        onApply(selectedRole);
        onClose();
    };

    const handleReset = () => {
        setSelectedRole("");
    };

    const handleClose = () => {
        setSelectedRole(currentRole);
        onClose();
    };

    const isFilterActive = selectedRole !== "";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/30">
            {/* Overlay */}
            <div 
                className="absolute inset-0"
                onClick={handleClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Sparkles size={20} className="text-cyan-500" />
                        <h3 className="text-lg font-semibold text-gray-900">Filter User</h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <div className="px-6 py-4">
                    <div className="space-y-4">
                        {/* Role Filter */}
                        <FormSelect
                            label="Filter berdasarkan Role"
                            name="role"
                            value={selectedRole}
                            onChange={(value) => setSelectedRole(value)}
                            options={roleOptions}
                            placeholder="Semua Role"
                            icon={UserCircle}
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                    <Button 
                        variant="custom"
                        className="text-cyan-500 flex-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        icon="RotateCcw"
                        size="sm"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                    <Button 
                        variant="custom"
                        className="text-cyan-500 flex-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex-items-center justify-center"
                        size="sm"
                        onClick={handleClose}
                    >
                        Batal
                    </Button>
                    <Button 
                        variant="custom"
                        className="text-cyan-500"
                        customColor={{
                            bg: 'bg-gradient-to-r from-cyan-400 to-sky-700',
                            hover: 'hover:bg-cyan-600',
                            text: 'text-white'
                        }}
                        icon="Sparkles"
                        size="md"
                        onClick={handleApply}
                    >
                        Terapkan
                    </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}