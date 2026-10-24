import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { User, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Pagination } from '../../components/common/Pagination';
import {
  Users,
  Search,
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  AlertCircle,
  Plus,
  KeyRound,
  Trash2,
  Check,
  X,
  UserCheck,
  UserX,
  RefreshCw,
  FileText,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Create User Form state
  const [createForm, setCreateForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: 'Password@123',
    role: 'READER' as UserRole,
    bio: '',
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Reset Password Form state
  const [newPassword, setNewPassword] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [page, roleFilter, statusFilter, search]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await api.get('/users/stats');
      setStats(res.data.data);
    } catch (err) {
      console.error('Không thể tải thống kê người dùng', err);
    }
  };

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/users', {
        params: {
          page,
          limit: 10,
          role: roleFilter || undefined,
          status: statusFilter || undefined,
          search: search || undefined,
        },
      });
      setUsers(res.data.data);
      setTotalPages(res.data.meta.totalPages);
      setTotal(res.data.meta.total);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (targetUser: User, newRole: UserRole) => {
    if (targetUser.id === currentUser?.id && newRole !== 'ADMIN') {
      alert('Bạn không thể tự hạ vai trò ADMIN của chính mình.');
      return;
    }

    const confirmMsg = `Bạn có chắc muốn cấp vai trò "${newRole}" cho tài khoản "${targetUser.fullName}" (@${targetUser.username})?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      setActionLoading(targetUser.id);
      await api.patch(`/users/${targetUser.id}/admin`, { role: newRole });
      await loadUsers();
      await loadStats();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể đổi vai trò.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (targetUser: User) => {
    if (targetUser.id === currentUser?.id) {
      alert('Bạn không thể tự khóa tài khoản của chính mình.');
      return;
    }
    const actionText = targetUser.isActive ? 'KHÓA' : 'MỞ KHÓA';
    const note = targetUser.isActive
      ? 'Khi bị khóa, tài khoản này sẽ bị hủy phiên đăng nhập tức thời và không thể truy cập hệ thống.'
      : 'Tài khoản sẽ được kích hoạt lại và có thể đăng nhập bình thường.';

    if (!window.confirm(`Xác nhận ${actionText} tài khoản "${targetUser.username}"?\n${note}`)) {
      return;
    }

    try {
      setActionLoading(targetUser.id);
      await api.patch(`/users/${targetUser.id}/admin`, { isActive: !targetUser.isActive });
      await loadUsers();
      await loadStats();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (targetUser: User) => {
    if (targetUser.id === currentUser?.id) {
      alert('Bạn không thể xóa tài khoản của chính mình.');
      return;
    }

    const confirmMsg = `CẢNH BÁO: Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản "${targetUser.fullName}" (@${targetUser.username})?\nCác bài viết của người này sẽ được chuyển về Admin sở hữu để bảo toàn nội dung.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      setActionLoading(targetUser.id);
      await api.delete(`/users/${targetUser.id}`);
      await loadUsers();
      await loadStats();
      alert(`Đã xóa tài khoản @${targetUser.username} thành công!`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể xóa tài khoản.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setIsCreating(true);

    try {
      await api.post('/users', createForm);
      setIsCreateModalOpen(false);
      setCreateForm({
        fullName: '',
        email: '',
        username: '',
        password: 'Password@123',
        role: 'READER',
        bio: '',
      });
      await loadUsers();
      await loadStats();
      alert('Đã tạo tài khoản người dùng mới thành công!');
    } catch (err: any) {
      setCreateError(err.response?.data?.message || 'Lỗi khi tạo người dùng.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setResetError(null);
    setIsResetting(true);

    try {
      await api.patch(`/users/${selectedUser.id}/reset-password`, { newPassword });
      setIsResetPasswordModalOpen(false);
      setNewPassword('');
      setSelectedUser(null);
      alert(`Đã đặt lại mật khẩu thành công cho tài khoản @${selectedUser.username}!`);
    } catch (err: any) {
      setResetError(err.response?.data?.message || 'Lỗi khi đặt lại mật khẩu.');
    } finally {
      setIsResetting(false);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'EDITOR':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'AUTHOR':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'READER':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section with Action Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600" />
            Quản lý Người dùng & Cấp quyền RBAC
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Toàn quyền quản trị tài khoản, cấp quyền vai trò (Admin, Editor, Author, Reader), khóa tài khoản và quản trị bảo mật hệ thống.
          </p>
        </div>
        <button
          onClick={() => {
            setCreateError(null);
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Thêm người dùng mới</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Tổng người dùng</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{stats?.total || total || 0}</p>
            <div className="flex items-center gap-2 mt-1.5 text-[11px] font-medium">
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> {stats?.active || 0} Hoạt động
              </span>
              {stats?.locked > 0 && (
                <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <UserX className="w-3 h-3" /> {stats?.locked} Bị khóa
                </span>
              )}
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-xs">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Quản trị viên (ADMIN)</p>
            <p className="text-2xl font-black text-red-600 mt-0.5">{stats?.roles?.admins || 0}</p>
            <span className="inline-block mt-1.5 text-[11px] font-bold text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md">
              Toàn quyền hệ thống
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Biên tập viên (EDITOR)</p>
            <p className="text-2xl font-black text-purple-600 mt-0.5">{stats?.roles?.editors || 0}</p>
            <span className="inline-block mt-1.5 text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md">
              Duyệt bài & bình luận
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-500 text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Tác giả & Độc giả</p>
            <p className="text-2xl font-black text-blue-600 mt-0.5">
              {(stats?.roles?.authors || 0) + (stats?.roles?.readers || 0)}
            </p>
            <span className="inline-block mt-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
              {stats?.roles?.authors || 0} Authors | {stats?.roles?.readers || 0} Readers
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo tên, email, username..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Lọc vai trò */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
          >
            <option value="">Tất cả vai trò</option>
            <option value="ADMIN">Quản trị viên (ADMIN)</option>
            <option value="EDITOR">Biên tập viên (EDITOR)</option>
            <option value="AUTHOR">Tác giả (AUTHOR)</option>
            <option value="READER">Độc giả (READER)</option>
          </select>

          {/* Lọc trạng thái */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="locked">Đã bị khóa</option>
          </select>

          <button
            onClick={() => {
              loadUsers();
              loadStats();
            }}
            className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
            title="Làm mới danh sách"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <LoadingSpinner text="Đang tải danh sách người dùng..." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Người dùng</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Cấp quyền (Vai trò RBAC)</th>
                  <th className="py-3.5 px-4 text-center">Hoạt động</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4">Ngày đăng ký</th>
                  <th className="py-3.5 px-4 text-right">Thao tác quản trị</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const isCurrent = u.id === currentUser?.id;
                  const isLoadingAction = actionLoading === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition">
                      {/* Cột 1: Thông tin người dùng */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'}
                            alt={u.fullName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-slate-900">{u.fullName}</p>
                              {isCurrent && (
                                <span className="text-[10px] bg-brand-100 text-brand-800 font-bold px-1.5 py-0.2 rounded">
                                  Bạn
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400">@{u.username}</p>
                          </div>
                        </div>
                      </td>

                      {/* Cột 2: Email */}
                      <td className="py-3 px-4 font-mono text-slate-600">{u.email}</td>

                      {/* Cột 3: Cấp quyền vai trò RBAC trực quan */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                            disabled={isLoadingAction || isCurrent}
                            className={`text-xs font-bold py-1.5 px-2.5 rounded-lg border focus:outline-none transition ${getRoleBadge(
                              u.role
                            )} disabled:opacity-60 disabled:cursor-not-allowed`}
                          >
                            <option value="ADMIN">ADMIN (Quản trị viên)</option>
                            <option value="EDITOR">EDITOR (Biên tập viên)</option>
                            <option value="AUTHOR">AUTHOR (Tác giả bài)</option>
                            <option value="READER">READER (Độc giả)</option>
                          </select>
                        </div>
                      </td>

                      {/* Cột 4: Thống kê hoạt động */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-2 text-slate-500 text-[11px]">
                          <span className="flex items-center gap-1" title={`${u._count?.posts || 0} bài viết`}>
                            <FileText className="w-3.5 h-3.5 text-blue-500" />
                            {u._count?.posts || 0}
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="flex items-center gap-1" title={`${u._count?.comments || 0} bình luận`}>
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                            {u._count?.comments || 0}
                          </span>
                        </div>
                      </td>

                      {/* Cột 5: Trạng thái (Hoạt động / Khóa) */}
                      <td className="py-3 px-4">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Đang hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            Đã bị khóa
                          </span>
                        )}
                      </td>

                      {/* Cột 6: Ngày tạo */}
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                      </td>

                      {/* Cột 7: Các nút thao tác */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Nút Khóa / Mở khóa */}
                          <button
                            onClick={() => handleToggleActive(u)}
                            disabled={isLoadingAction || isCurrent}
                            className={`p-1.5 rounded-lg border transition ${
                              u.isActive
                                ? 'text-amber-600 border-amber-200 hover:bg-amber-50'
                                : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                            } disabled:opacity-30 disabled:cursor-not-allowed`}
                            title={
                              isCurrent
                                ? 'Không thể tự khóa tài khoản của chính mình'
                                : u.isActive
                                ? 'Khóa tài khoản (chặn truy cập)'
                                : 'Mở khóa tài khoản'
                            }
                          >
                            {u.isActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>

                          {/* Nút Đặt lại mật khẩu */}
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setNewPassword('Password@123');
                              setResetError(null);
                              setIsResetPasswordModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border text-blue-600 border-blue-200 hover:bg-blue-50 transition"
                            title="Đặt lại mật khẩu cho tài khoản này"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {/* Nút Xóa tài khoản */}
                          <button
                            onClick={() => handleDeleteUser(u)}
                            disabled={isLoadingAction || isCurrent}
                            className="p-1.5 rounded-lg border text-red-600 border-red-200 hover:bg-red-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                            title={
                              isCurrent
                                ? 'Không thể tự xóa tài khoản của chính mình'
                                : 'Xóa tài khoản người dùng'
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </div>
      )}

      {/* MODAL: Thêm người dùng mới */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand-600" />
                Thêm người dùng mới
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="user@ictu.edu.vn"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên đăng nhập *</label>
                  <input
                    type="text"
                    required
                    value={createForm.username}
                    onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                    placeholder="nguyenvanan"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu ban đầu *</label>
                  <input
                    type="text"
                    required
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vai trò cấp quyền *</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as UserRole })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white font-bold"
                  >
                    <option value="READER">Độc giả (READER)</option>
                    <option value="AUTHOR">Tác giả (AUTHOR)</option>
                    <option value="EDITOR">Biên tập viên (EDITOR)</option>
                    <option value="ADMIN">Quản trị viên (ADMIN)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiểu sử ngắn (tùy chọn)</label>
                <textarea
                  rows={2}
                  value={createForm.bio}
                  onChange={(e) => setCreateForm({ ...createForm, bio: e.target.value })}
                  placeholder="Mô tả chuyên môn hoặc giới thiệu sơ lược..."
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition disabled:opacity-50"
                >
                  {isCreating ? 'Đang tạo...' : 'Tạo tài khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Đặt lại mật khẩu */}
      {isResetPasswordModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-600" />
                Đặt lại mật khẩu người dùng
              </h3>
              <button
                onClick={() => setIsResetPasswordModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {resetError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="mt-4 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
                <p className="font-semibold text-slate-800">Tài khoản đích:</p>
                <p className="text-slate-600 font-bold mt-0.5">{selectedUser.fullName} (@{selectedUser.username})</p>
                <p className="text-slate-500 text-[11px] font-mono">{selectedUser.email}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu mới *</label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsResetPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
                >
                  {isResetting ? 'Đang lưu...' : 'Xác nhận đổi mật khẩu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
