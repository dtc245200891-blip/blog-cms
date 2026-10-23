import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, ExternalLink, LogOut, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminHeader: React.FC<{ onToggleSidebar: () => void; title?: string }> = ({
  onToggleSidebar,
  title = 'Trang Quản Trị Hệ Thống',
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          title="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-brand-600 hidden sm:block" />
          <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Link
          to="/"
          target="_blank"
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-brand-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition"
        >
          <span>Xem Blog</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center space-x-2">
          <img
            src={
              user?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'
            }
            alt={user?.fullName}
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
          <span className="hidden md:block text-xs font-semibold text-slate-700">
            {user?.fullName}
          </span>
        </div>

        <button
          onClick={logout}
          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          title="Đăng xuất"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
