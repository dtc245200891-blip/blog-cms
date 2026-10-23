import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading, canAccessAdmin } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <LoadingSpinner text="Đang kiểm tra quyền quản trị..." />
      </div>
    );
  }

  // Nếu chưa đăng nhập -> chuyển về login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu vai trò chỉ là READER -> chặn truy cập admin
  if (!canAccessAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-sm border border-red-200">
          <h2 className="text-xl font-bold text-red-600 mb-2">Truy cập bị từ chối (403)</h2>
          <p className="text-sm text-slate-600 mb-6">
            Tài khoản của bạn ({user?.email}) mang vai trò <strong className="text-slate-800">{user?.role}</strong>, không có thẩm quyền truy cập hệ thống quản trị CMS.
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition"
          >
            Quay lại trang chủ Blog
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
