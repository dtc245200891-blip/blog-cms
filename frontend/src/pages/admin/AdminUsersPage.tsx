import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { User, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Pagination } from '../../components/common/Pagination';
import { Users, Search, Lock, Unlock, Shield, AlertCircle } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, [page, roleFilter, search]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/users', {
        params: {
          page,
          limit: 10,
          role: roleFilter || undefined,
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

  const handleRoleChange = async (targetUserId: string, newRole: UserRole) => {
    try {
      setActionLoading(targetUserId);
      await api.patch(`/users/${targetUserId}/admin`, { role: newRole });
      loadUsers();
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
    const actionText = targetUser.isActive ? 'khóa' : 'mở khóa';
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản "${targetUser.username}"?`)) return;

    try {
      setActionLoading(targetUser.id);
      await api.patch(`/users/${targetUser.id}/admin`, { isActive: !targetUser.isActive });
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý người dùng</h2>
        <p className="text-xs text-slate-500 mt-1">
          Quản lý tài khoản, phân quyền vai trò (RBAC) và kiểm soát trạng thái hoạt động ({total} tài khoản)
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo tên, email, username..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none w-full sm:w-auto"
        >
          <option value="">Tất cả vai trò</option>
          <option value="ADMIN">Quản trị viên (ADMIN)</option>
          <option value="EDITOR">Biên tập viên (EDITOR)</option>
          <option value="AUTHOR">Tác giả (AUTHOR)</option>
          <option value="READER">Độc giả (READER)</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Đang tải danh sách người dùng..." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Người dùng</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Vai trò (RBAC)</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Ngày đăng ký</th>
                  <th className="py-3 px-4 text-right">Khóa / Mở khóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 flex items-center space-x-2.5">
                      <img
                        src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'}
                        alt={u.fullName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{u.fullName}</p>
                        <p className="text-[11px] text-slate-400">@{u.username}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        disabled={actionLoading === u.id || u.id === currentUser?.id}
                        className="text-xs font-bold py-1 px-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="EDITOR">EDITOR</option>
                        <option value="AUTHOR">AUTHOR</option>
                        <option value="READER">READER</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      {u.isActive ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-800">
                          Đang hoạt động
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800">
                          Đã bị khóa
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleActive(u)}
                        disabled={actionLoading === u.id || u.id === currentUser?.id}
                        className={`p-1.5 rounded-lg border transition ${
                          u.isActive
                            ? 'text-red-600 border-red-200 hover:bg-red-50'
                            : 'text-green-600 border-green-200 hover:bg-green-50'
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                        title={u.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      >
                        {u.isActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
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
    </div>
  );
};
