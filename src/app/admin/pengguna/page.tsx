"use client";

import { getRole, getVerificationStatus, UserData } from "@/helper/RoleVerifed";
import { Mail, Users, Loader2 } from "lucide-react";
import ActionButton from "@/components/common/ActionButton";
import Button from "@/components/common/Button";
import SearchInput from "@/components/common/Serach";
import Pagination from "@/components/common/pagination";
import { useState, useEffect, useCallback } from "react";
import ModalAddUser from "@/app/admin/pengguna/components/AddUser";
import ModalEditUser from "@/app/admin/pengguna/components/EditUser";
import ModalDelete from "@/components/modal/ModalDelete";
import ModalFilterUser from "@/app/admin/pengguna/components/FilterRole";
import { Toasts } from "@/components/modal/Toast";
import { UserApiService } from "@/app/service/userApiService";

export default function Pengguna() {
    const [value, setValue] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(5);

    // Fetch users function
    const fetchUsers = useCallback(async (search?: string, role?: string, page: number = 1) => {
        try {
            setLoading(true);
            setError(null);
            const response = await UserApiService.getUsers(search, role || '', page, itemsPerPage);
            
            if (response.success && response.data) {
                setUsers(response.data);
                if (response.pagination) {
                    setTotalPages(response.pagination.totalPages);
                    setTotalItems(response.pagination.totalItems);
                }
            } else {
                setError(response.error || 'Gagal memuat data users');
            }
        } catch (err) {
            setError('Terjadi kesalahan saat memuat data');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    }, [itemsPerPage]);

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Fetch users when search value changes (with debounce)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1); // Reset to first page when searching
            fetchUsers(value, selectedRole, 1);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [value, selectedRole, fetchUsers]);

    // Fetch users when page changes
    useEffect(() => {
        fetchUsers(value, selectedRole, currentPage);
    }, [currentPage, value, selectedRole, fetchUsers]);

    const handleDeleteClick = (user: UserData) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    }

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        setDeleteLoading(false);
    }

    const handleConfirmDelete = async () => {
        if (!selectedUser) return;

        try {
            setDeleteLoading(true);
            const response = await UserApiService.deleteUser(selectedUser.id);
            
            if (response.success) {
                // Refresh users list
                await fetchUsers(value, selectedRole, currentPage);
                setIsDeleteModalOpen(false);
                setSelectedUser(null);
                
                // Show success toast
                Toasts(
                    'success',
                    4000,
                    'User Berhasil Dihapus!',
                    `User ${selectedUser.namaPerusahaan} telah dihapus dari sistem`
                );
            } else {
                // Show error toast
                Toasts(
                    'danger',
                    5000,
                    'Gagal Menghapus User',
                    response.error || 'Terjadi kesalahan saat menghapus user'
                );
            }
        } catch (err) {
            // Show error toast
            Toasts(
                'danger',
                5000,
                'Error!',
                `Terjadi kesalahan saat menghapus user: ${err instanceof Error ? err.message : 'Unknown error'}`
            );
        } finally {
            setDeleteLoading(false);
        }
    }

    const handleAddUser = () => {
        setIsAddModalOpen(true);
    }

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    }

    const handleEditUser = (user: UserData) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    }

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
    }

    const handleFilterClick = () => {
        setIsFilterModalOpen(true);
    }

    const handleCloseFilterModal = () => {
        setIsFilterModalOpen(false);
    }

    const handleApplyFilter = (role: string) => {
        setSelectedRole(role);
        setCurrentPage(1); // Reset to first page when filtering
        fetchUsers(value, role, 1);
    }

    const handleSubmitUser = async (data: { 
        username: string; 
        email: string; 
        password: string;
        confirmPassword: string;
        role: string;
        emailVerification: string;
    }) => {
        try {
            const response = await UserApiService.createUser(data);
            
            if (response.success) {
                await fetchUsers(value, selectedRole, currentPage);
                setIsAddModalOpen(false);
                
                // Show success toast
                Toasts(
                    'success',
                    4000,
                    'User Berhasil Dibuat!',
                    `User ${data.username} telah berhasil ditambahkan ke sistem`
                );
            } else {
                // Show error toast
                Toasts(
                    'danger',
                    5000,
                    'Gagal Membuat User',
                    response.error || 'Terjadi kesalahan saat membuat user'
                );
            }
        } catch (err) {
            // Show error toast
            Toasts(
                'danger',
                5000,
                'Error!',
                `Terjadi kesalahan saat membuat user: ${err instanceof Error ? err.message : 'Unknown error'}`
            );
        }
    }

    const handleUpdateUser = async (data: { 
        username: string; 
        email: string; 
        role: string;
        emailVerification: string;
    }) => {
        if (!selectedUser) return;

        try {
            const response = await UserApiService.updateUser(selectedUser.id, data);
            
            if (response.success) {
                // Refresh users list
                await fetchUsers(value, selectedRole, currentPage);
                setIsEditModalOpen(false);
                setSelectedUser(null);
                
                // Show success toast
                Toasts(
                    'success',
                    4000,
                    'User Berhasil Diperbarui!',
                    `Data user ${data.username} telah berhasil diperbarui`
                );
            } else {
                // Show error toast
                Toasts(
                    'danger',
                    5000,
                    'Gagal Memperbarui User',
                    response.error || 'Terjadi kesalahan saat memperbarui user'
                );
            }
        } catch (err) {
            // Show error toast
            Toasts(
                'danger',
                5000,
                'Error!',
                `Terjadi kesalahan saat memperbarui user: ${err instanceof Error ? err.message : 'Unknown error'}`
            );
        }
    }

    return (
        <div className="min-h-screen p-6 bg-gray-50">
        <div className="space-y-4">
            {/* Table Section */}
            <div className='bg-white rounded-lg shadow overflow-hidden'>
                {/* Table Header with Button */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                    <div className="flex align-items-start justify-content-center gap-2 font-semibold"> 
                        <Users size={24} className="text-cyan-500"/>
                        Daftar User
                    </div>
                    <Button 
                        variant="custom"
                        className="text-cyan-500"
                        customColor={{
                            bg: 'bg-gradient-to-r from-cyan-400 to-sky-700',
                            hover: 'hover:bg-cyan-600',
                            text: 'text-white'
                        }}
                        icon="Plus"
                        size="md"
                        onClick={handleAddUser}
                    >
                        Tambah User
                    </Button>
                </div>
                <div className="flex align-items-center justify-between px-4 py-3">
                    <div className="flex align-items-center gap-2">
                        <SearchInput 
                            value={value}
                            onChange={setValue}
                            placeholder="Cari user..."
                            size="md"
                            className="w-100"
                        />
                        <Button
                            variant="custom"
                            className="border border-cyan-500 text-cyan-500"
                            customColor={{
                                bg: 'bg-white',
                                hover: 'hover:bg-cyan-600 hover:text-white',
                                text: 'text-cyan-500'
                            }}
                            icon="Sparkles"
                            size="md"
                            onClick={handleFilterClick}
                        >
                            Filter
                        </Button>
                    </div>
                </div>

                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50 border-b border-gray-200'>
                            <tr>
                                <th className='text-left py-3 px-4 font-medium text-gray-600 text-sm'>User</th>
                                <th className='text-left py-3 px-4 font-medium text-gray-600 text-sm'>Email & Verifikasi</th>
                                <th className='text-left py-3 px-4 font-medium text-gray-600 text-sm'>Role</th>
                                <th className='text-left py-3 px-4 font-medium text-gray-600 text-sm'>Terdaftar Pada</th>
                                <th className='text-left py-3 px-4 font-medium text-gray-600 text-sm'>Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-8 px-4 text-center">
                                        <div className="flex items-center justify-center gap-2 text-gray-500">
                                            <Loader2 size={20} className="animate-spin" />
                                            <span>Memuat data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={5} className="py-8 px-4 text-center">
                                        <div className="text-red-500">
                                            <p>{error}</p>
                                            <button 
                                                onClick={() => fetchUsers(value)}
                                                className="mt-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                                            >
                                                Coba Lagi
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 px-4 text-center text-gray-500">
                                        Tidak ada data user
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => {
                                    const roleInfo = getRole(user.status);
                                    const verificationInfo = getVerificationStatus(user.verifed_at);
                                    const RoleIcon = roleInfo.icon;
                                    const VerificationIcon = verificationInfo.icon;

                                    return (
                                        <tr key={user.id} className='hover:bg-gray-50 transition-colors'>
                                            <td className='py-4 px-4'>
                                                <div className='flex items-center gap-3'>
                                                    <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-semibold">
                                                        {user.namaPerusahaan.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className='font-medium text-gray-900'>{user.namaPerusahaan}</div>
                                                        <div className='text-sm text-gray-500 flex items-center gap-1'>
                                                            ID: {user.id_user}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='py-4 px-4'>
                                                <div className='text-sm text-gray-600 space-y-1'>
                                                    <div className='flex items-center gap-1'>
                                                        <Mail size={15} className="text-gray-400" />
                                                        <span className="text-gray-700">{user.email}</span>
                                                    </div>
                                                    <div className='flex items-center gap-1'>
                                                        <span className={`${verificationInfo.bgColor} ${verificationInfo.textColor} px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit`}>
                                                            <VerificationIcon size={14} />
                                                            {verificationInfo.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='py-4 px-4'>
                                                <span className={`${roleInfo.bgColor} ${roleInfo.textColor} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 w-fit`}>
                                                    <RoleIcon size={16} />
                                                    {roleInfo.label}
                                                </span>
                                            </td>
                                            <td className='py-4 px-4'>
                                                <span className="text-gray-700 text-sm">{user.Terdaftar_pada}</span>
                                            </td>
                                            <td className='py-4 px-4'>
                                                <div className='flex gap-2'>
                                                <ActionButton 
                                                    color="warning" 
                                                    icon="Pencil"
                                                    tooltip="Edit"
                                                    onClick={() => handleEditUser(user)}
                                                />

                                                    <ActionButton 
                                                        color="danger" 
                                                        icon="Trash2"
                                                        tooltip="Delete"
                                                        onClick={() => handleDeleteClick(user)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && !error && users.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems}
                    />
                )}
            </div>

            {/* Add User Modal */}
            <ModalAddUser
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onSubmit={handleSubmitUser}
            />

            {/* Edit User Modal */}
            <ModalEditUser
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSubmit={handleUpdateUser}
                userData={selectedUser ? {
                    username: selectedUser.namaPerusahaan,
                    email: selectedUser.email,
                    role: selectedUser.status,
                    emailVerification: selectedUser.verifed_at.toLowerCase()
                } : null}
            />

            {/* Delete User Modal */}
            <ModalDelete
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Hapus User?"
                description="Data user yang dihapus tidak dapat dikembalikan. Apakah Anda yakin ingin menghapus user ini?"
                userName={selectedUser?.namaPerusahaan}
                isLoading={deleteLoading}
            />

            {/* Filter User Modal */}
            <ModalFilterUser
                isOpen={isFilterModalOpen}
                onClose={handleCloseFilterModal}
                onApply={handleApplyFilter}
                currentRole={selectedRole}
            />
        </div>
        </div>
    )
}