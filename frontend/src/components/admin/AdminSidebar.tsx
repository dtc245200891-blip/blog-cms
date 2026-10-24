import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  Tags,
  MessageSquare,
  Users,
  Image,
  Settings,
  ShieldCheck,
  ArrowLeft,
  GraduationCap,
  Activity,
  ExternalLink,
} from 'lucide-react';

export const AdminSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { user, isAdmin, isEditor } = useAuth();

  const navItems = [
    {
      to: '/admin',
      label: 'Bảng điều khiển',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'EDITOR', 'AUTHOR'],
      exact: true,
    },
    {
      to: '/admin/posts',
      label: 'Quản lý bài viết',
      icon: FileText,
      roles: ['ADMIN', 'EDITOR', 'AUTHOR'],
    },
    {
      to: '/admin/posts/new',
      label: 'Tạo bài viết mới',
      icon: PlusCircle,
      roles: ['ADMIN', 'EDITOR', 'AUTHOR'],
    },
    {
      to: '/admin/categories',
      label: 'Quản lý danh mục',
      icon: FolderTree,
      roles: ['ADMIN', 'EDITOR'],
    },
    {
      to: '/admin/tags',
      label: 'Quản lý thẻ',
      icon: Tags,
      roles: ['ADMIN', 'EDITOR'],
    },
    {
      to: '/admin/comments',
      label: 'Kiểm duyệt bình luận',
      icon: MessageSquare,
      roles: ['ADMIN', 'EDITOR'],
    },
    {
      to: '/admin/media',
      label: 'Thư viện Media',
      icon: Image,
      roles: ['ADMIN', 'EDITOR', 'AUTHOR'],
    },
    {
      to: '/admin/users',
      label: 'Quản lý người dùng',
      icon: Users,
      roles: ['ADMIN'],
    },
    {
      to: '/admin/audit-logs',
      label: 'Nhật ký hoạt động',
      icon: ShieldCheck,
      roles: ['ADMIN'],
    },
    {
      to: '/admin/settings',
      label: 'Cấu hình hệ thống',
      icon: Settings,
      roles: ['ADMIN'],
    },
    {
      to: 'http://localhost:3001',
      label: 'Giám sát Grafana',
      icon: Activity,
      roles: ['ADMIN', 'EDITOR'],
      isExternal: true,
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link to="/admin" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              ICTU <span className="text-brand-400">CMS</span>
            </span>
          </Link>
        </div>

        {/* User Info Capsule */}
        <div className="p-4 mx-4 my-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center space-x-3">
          <img
            src={
              user?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'
            }
            alt={user?.fullName}
            className="w-10 h-10 rounded-full object-cover border border-brand-500"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-brand-400">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Quản trị nội dung
          </p>
          {filteredNavItems.map((item: any) => {
            const Icon = item.icon;
            if (item.isExternal) {
              return (
                <a
                  key={item.to}
                  href={item.to}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-amber-400 hover:text-amber-300 hover:bg-slate-800/70 transition border border-amber-500/20 my-1 bg-amber-500/5"
                >
                  <div className="flex items-center space-x-3 truncate">
                    <Icon className="w-4 h-4 flex-shrink-0 text-amber-400 animate-pulse" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
                </a>
              );
            }
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Return to website */}
        <div className="p-4 border-t border-slate-800">
          <Link
            to="/"
            className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về trang chủ Blog</span>
          </Link>
        </div>
      </aside>
    </>
  );
};
