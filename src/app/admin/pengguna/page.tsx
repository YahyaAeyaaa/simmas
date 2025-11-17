// app/admin/pengguna/page.tsx
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
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(5);

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

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(value, selectedRole, 1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [value, selectedRole, fetchUsers]);

  useEffect(() => {
    fetchUsers(value, selectedRole, currentPage);
  }, [currentPage, value, selectedRole, fetchUsers]);

  const handleDeleteClick = (user: UserData) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
    setDeleteLoading(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      setDeleteLoading(true);
      const response = await UserApiService.deleteUser(selectedUser.id);

      if (response.success) {
        await fetchUsers(value, selectedRole, currentPage);
        setIsDeleteModalOpen(false);
        setSelectedUser(null);

        Toasts('success', 4000, 'User Berhasil Dihapus!', `User ${selectedUser.namaPerusahaan} telah dihapus dari sistem`);
      } else {
        Toasts('danger', 5000, 'Gagal Menghapus User', response.error || 'Terjadi kesalahan saat menghapus user');
      }
    } catch (err) {
      Toasts('danger', 5000, 'Error!', `Terjadi kesalahan saat menghapus user: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddUser = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  // IMPORTANT: fetch full user detail before opening edit modal
  const handleEditUser = async (user: UserData) => {
    try {
      const resp = await UserApiService.getUserById(user.id);
      if (resp.success && resp.data) {
        // resp.data might come with nested objects from backend; map to modal shape
        const u = resp.data;
        setSelectedUser({
          id: u.id,
          namaPerusahaan: u.namaPerusahaan ?? (u.name ?? u.email),
          email: u.email,
          status: u.status ?? u.role,
          verifed_at: (u.verifed_at ?? (u.emailVerifiedAt ? 'verified' : 'unverified'))?.toString() ?? 'unverified',
          jurusan: u.jurusan ?? (u.siswa?.jurusan ?? null),
          kelas: u.kelas ?? (u.siswa?.kelas ?? null),
          nis: u.nis ?? (u.siswa?.nis ?? null),
          nip: u.nip ?? (u.guru?.nip ?? null)
        });
        setIsEditModalOpen(true);
      } else {
        Toasts('danger', 4000, 'Gagal', resp.error || 'Gagal mengambil data user');
      }
    } catch (err) {
      console.error('Error fetching user for edit', err);
      Toasts('danger', 5000, 'Error', 'Terjadi kesalahan saat memuat data user');
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleFilterClick = () => setIsFilterModalOpen(true);
  const handleCloseFilterModal = () => setIsFilterModalOpen(false);

  const handleApplyFilter = (role: string) => {
    setSelectedRole(role);
    setCurrentPage(1);
    fetchUsers(value, role, 1);
  };

  const handleSubmitUser = async (data: { 
    username: string; 
    email: string; 
    password: string;
    confirmPassword?: string;
    role: string;
    emailVerification: string;
    jurusan?: string;
    kelas?: 'XI'|'XII' | string;
    nis?: number;
    nip?: string;
  }) => {
    try {
      const response = await UserApiService.createUser(data);

      if (response.success) {
        await fetchUsers(value, selectedRole, currentPage);
        setIsAddModalOpen(false);

        Toasts('success', 4000, 'User Berhasil Dibuat!', `User ${data.username} telah berhasil ditambahkan ke sistem`);
      } else {
        Toasts('danger', 5000, 'Gagal Membuat User', response.error || 'Terjadi kesalahan saat membuat user');
      }
    } catch (err) {
      Toasts('danger', 5000, 'Error!', `Terjadi kesalahan saat membuat user: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleUpdateUser = async (data: { 
    username: string; 
    email: string; 
    role: string;
    emailVerification: string;
    jurusan?: string | null;
    kelas?: string | null;
    nis?: number | null;
    nip?: string | null;
  }) => {
    if (!selectedUser) return;
    try {
      const response = await UserApiService.updateUser(selectedUser.id, data);
      if (response.success) {
        await fetchUsers(value, selectedRole, currentPage);
        setIsEditModalOpen(false);
        setSelectedUser(null);
        Toasts('success', 4000, 'User Berhasil Diperbarui!', `Data user ${data.username} telah berhasil diperbarui`);
      } else {
        Toasts('danger', 5000, 'Gagal Memperbarui User', response.error || 'Terjadi kesalahan saat memperbarui user');
      }
    } catch (err) {
      Toasts('danger', 5000, 'Error!', `Terjadi kesalahan saat memperbarui user: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="space-y-4">
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
            <div className="flex align-items-start justify-content-center gap-2 font-semibold"> 
              <Users size={24} className="text-cyan-500"/>
              Daftar User
            </div>
            <Button variant="custom" className="text-cyan-500" customColor={{ bg: 'bg-gradient-to-r from-cyan-400 to-sky-700', hover: 'hover:bg-cyan-600', text: 'text-white' }} icon="Plus" size="md" onClick={handleAddUser}>Tambah User</Button>
          </div>

          <div className="flex align-items-center justify-between px-4 py-3">
            <div className="flex align-items-center gap-2">
              <SearchInput value={value} onChange={setValue} placeholder="Cari user..." size="md" className="w-100" />
              <Button variant="custom" className="border border-cyan-500 text-cyan-500" customColor={{ bg: 'bg-white', hover: 'hover:bg-cyan-600 hover:text-white', text: 'text-cyan-500' }} icon="Sparkles" size="md" onClick={handleFilterClick}>Filter</Button>
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
                  <tr><td colSpan={5} className="py-8 px-4 text-center"><div className="text-red-500"><p>{error}</p><button onClick={() => fetchUsers(value)} className="mt-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">Coba Lagi</button></div></td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 px-4 text-center text-gray-500">Tidak ada data user</td></tr>
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
                              {((user.namaPerusahaan || user.email || `${user.id_user || user.id}`).charAt(0) || 'U').toUpperCase()}
                            </div>
                            <div>
                              <div className='font-medium text-gray-900'>{user.namaPerusahaan}</div>
                              <div className='text-sm text-gray-500 flex items-center gap-1'>ID: {user.id|| user.id_user}</div>
                              {user.status === 'siswa' && (
                                <>
                                  {user.jurusan && <div className='text-sm text-gray-500 flex items-center gap-1'>Jurusan: {user.jurusan}</div>}
                                  {user.kelas && <div className='text-sm text-gray-500 flex items-center gap-1'>Kelas: {user.kelas}</div>}
                                </>
                              )}
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
                            <ActionButton color="warning" icon="Pencil" tooltip="Edit" onClick={() => handleEditUser(user)} />
                            <ActionButton color="danger" icon="Trash2" tooltip="Edit" onClick={() => handleDeleteClick(user)} />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && !error && users.length > 0 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} itemsPerPage={itemsPerPage} totalItems={totalItems} />
          )}
        </div>

        <ModalAddUser isOpen={isAddModalOpen} onClose={handleCloseAddModal} onSubmit={handleSubmitUser} />

        <ModalEditUser isOpen={isEditModalOpen} onClose={handleCloseEditModal} onSubmit={handleUpdateUser} userData={selectedUser ? {
          username: selectedUser.namaPerusahaan,
          email: selectedUser.email,
          role: selectedUser.status,
          emailVerification: (selectedUser.verifed_at || 'unverified').toString(),
          jurusan: selectedUser.jurusan ?? "",
          kelas: selectedUser.kelas ?? "",
          nis: selectedUser.nis ?? "",
          nip: selectedUser.nip ?? ""
        } : null} />

        <ModalDelete isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} onConfirm={handleConfirmDelete} title="Hapus User?" description="Data user yang dihapus tidak dapat dikembalikan. Apakah Anda yakin ingin menghapus user ini?" userName={selectedUser?.namaPerusahaan} isLoading={deleteLoading} />

        <ModalFilterUser isOpen={isFilterModalOpen} onClose={handleCloseFilterModal} onApply={handleApplyFilter} currentRole={selectedRole} />
      </div>
    </div>
  );
}
