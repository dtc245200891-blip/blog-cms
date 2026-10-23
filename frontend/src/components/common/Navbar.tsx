import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { NotificationItem } from '../../types';
import {
  BookOpen,
  Search,
  Bell,
  Bookmark,
  User,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, canAccessAdmin } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data.notifications);
      setUnreadCount(res.data.data.unreadCount);
    } catch (err) {
      console.warn('Không thể tải thông báo.');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleMarkAsRead = async (id: string, link?: string | null) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      setIsNotificationsOpen(false);
      if (link) navigate(link);
    } catch (err) {
      console.error(err);
    }
  };

  const roleBadgeColor = {
    ADMIN: 'bg-red-100 text-red-700 border-red-200',
    EDITOR: 'bg-purple-100 text-purple-700 border-purple-200',
    AUTHOR: 'bg-blue-100 text-blue-700 border-blue-200',
    READER: 'bg-green-100 text-green-700 border-green-200',
  }[user?.role || 'READER'];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Slogan */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                  ICTU <span className="text-brand-600">Blog/CMS</span>
                </span>
                <span className="hidden sm:block text-[11px] text-slate-600 font-medium tracking-wide">
                  Đồ án CNTT K23L — Vũ Trọng Nghĩa
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Links Desktop */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-brand-600 transition-colors">
              Trang chủ
            </Link>
            <Link to="/posts" className="hover:text-brand-600 transition-colors">
              Bài viết
            </Link>
            <Link to="/categories" className="hover:text-brand-600 transition-colors">
              Danh mục
            </Link>
          </div>

          {/* Search Bar Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center relative w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="w-full pl-9 pr-4 py-1.5 text-sm rounded-full bg-slate-100 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && user ? (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsNotificationsOpen(!isNotificationsOpen);
                      setIsUserDropdownOpen(false);
                    }}
                    className="p-2 rounded-full text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition relative"
                    title="Thông báo"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Popover */}
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-semibold text-sm text-slate-800">Thông báo</span>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full font-medium">
                            {unreadCount} chưa đọc
                          </span>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-600">
                            Chưa có thông báo nào.
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => handleMarkAsRead(n.id, n.link)}
                              className={`p-3.5 hover:bg-slate-50 cursor-pointer transition flex flex-col ${
                                !n.isRead ? 'bg-brand-50/40' : ''
                              }`}
                            >
                              <span className="text-xs font-semibold text-slate-800">{n.title}</span>
                              <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                              <span className="text-[10px] text-slate-600 mt-1.5">
                                {new Date(n.createdAt).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(!isUserDropdownOpen);
                      setIsNotificationsOpen(false);
                    }}
                    className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 transition focus:outline-none"
                  >
                    <img
                      src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <span className="hidden md:inline-block text-sm font-semibold text-slate-700 max-w-[120px] truncate">
                      {user.fullName}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs text-slate-600">Đăng nhập với</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{user.fullName}</p>
                        <span
                          className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleBadgeColor}`}
                        >
                          Vai trò: {user.role}
                        </span>
                      </div>

                      {canAccessAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-brand-600" />
                          <span>Khu vực Quản trị (CMS)</span>
                        </Link>
                      )}

                      <Link
                        to="/saved-posts"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Bookmark className="w-4 h-4 text-slate-500" />
                        <span>Bài viết đã lưu</span>
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>Hồ sơ cá nhân</span>
                      </Link>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-brand-600 transition"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition shadow-xs"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-brand-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-slate-100 border border-slate-200 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </form>
            <div className="flex flex-col space-y-2 pt-2 text-sm font-medium text-slate-700">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-lg hover:bg-slate-100"
              >
                Trang chủ
              </Link>
              <Link
                to="/posts"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-lg hover:bg-slate-100"
              >
                Bài viết
              </Link>
              <Link
                to="/categories"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-lg hover:bg-slate-100"
              >
                Danh mục
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
