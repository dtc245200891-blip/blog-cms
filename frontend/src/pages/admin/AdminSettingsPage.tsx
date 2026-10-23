import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        const res = await api.get('/settings');
        setSettings(res.data.data.map);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setMessage(null);
      await api.patch('/settings', settings);
      setMessage('Cập nhật cấu hình hệ thống thành công!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể lưu cài đặt.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Đang tải cấu hình hệ thống..." />;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cấu hình hệ thống</h2>
        <p className="text-xs text-slate-500 mt-1">
          Thiết lập các tham số vận hành chung của Blog/CMS
        </p>
      </div>

      {message && (
        <div className="p-3 bg-green-50 border border-green-200 text-xs text-green-700 rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Tên cổng thông tin (Site Name)
          </label>
          <input
            type="text"
            value={settings.site_name || ''}
            onChange={(e) => handleChange('site_name', e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Mô tả website (Site Description)
          </label>
          <textarea
            value={settings.site_description || ''}
            onChange={(e) => handleChange('site_description', e.target.value)}
            rows={2}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Email liên hệ quản trị (Contact Email)
          </label>
          <input
            type="email"
            value={settings.contact_email || ''}
            onChange={(e) => handleChange('contact_email', e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Số lượng bài viết trên mỗi trang (Phân trang)
          </label>
          <input
            type="number"
            min={3}
            max={50}
            value={settings.items_per_page || '10'}
            onChange={(e) => handleChange('items_per_page', e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-3">
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allow_registration === 'true'}
              onChange={(e) => handleChange('allow_registration', e.target.checked ? 'true' : 'false')}
              className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
            />
            <span>Cho phép người dùng tự do đăng ký tài khoản độc giả mới</span>
          </label>

          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.comments_require_approval === 'true'}
              onChange={(e) => handleChange('comments_require_approval', e.target.checked ? 'true' : 'false')}
              className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
            />
            <span>Yêu cầu kiểm duyệt bình luận của độc giả trước khi công khai</span>
          </label>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Đang lưu...' : 'Lưu cấu hình hệ thống'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
