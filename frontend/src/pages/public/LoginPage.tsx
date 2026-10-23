import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Lock, Mail, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Vui lòng nhập đầy đủ thông tin đăng nhập.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const user = await login(identifier, password);

      // Nếu là Admin, Editor hoặc Author và đang chuyển hướng bình thường, có thể điều hướng thẳng vào trang quản trị
      if (['ADMIN', 'EDITOR', 'AUTHOR'].includes(user.role) && from === '/') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (email: string) => {
    setIdentifier(email);
    setPassword('Password@123');
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 mb-4">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Đăng nhập hệ thống
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Đồ án Blog/CMS ICTU — Sinh viên Vũ Trọng Nghĩa (K23L)
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email hoặc Tên đăng nhập
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@ictu.edu.vn hoặc admin"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">Mật khẩu</label>
              <Link
                to="/forgot-password"
                className="text-xs text-brand-600 hover:text-brand-700 font-medium"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-brand-600/20 transition disabled:opacity-50"
          >
            {isLoading ? 'Đang xác thực...' : 'Đăng nhập ngay'}
          </button>
        </form>

        {/* Quick Demo Fill Buttons for Grading */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 text-center">
            Tài khoản dùng thử báo cáo (1-Click điền thông tin):
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillDemoAccount('admin@ictu.edu.vn')}
              className="p-2 text-left rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-800 transition"
            >
              <span className="font-bold block text-[11px]">1. Quản trị viên (Admin)</span>
              <span className="text-[10px] text-slate-500">admin@ictu.edu.vn</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('editor@ictu.edu.vn')}
              className="p-2 text-left rounded-lg border border-purple-200 bg-purple-50/50 hover:bg-purple-50 text-purple-800 transition"
            >
              <span className="font-bold block text-[11px]">2. Biên tập viên (Editor)</span>
              <span className="text-[10px] text-slate-500">editor@ictu.edu.vn</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('author1@ictu.edu.vn')}
              className="p-2 text-left rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-800 transition"
            >
              <span className="font-bold block text-[11px]">3. Tác giả Nghĩa (Author)</span>
              <span className="text-[10px] text-slate-500">author1@ictu.edu.vn</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('reader1@ictu.edu.vn')}
              className="p-2 text-left rounded-lg border border-green-200 bg-green-50/50 hover:bg-green-50 text-green-800 transition"
            >
              <span className="font-bold block text-[11px]">4. Độc giả Nam (Reader)</span>
              <span className="text-[10px] text-slate-500">reader1@ictu.edu.vn</span>
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-600 mt-2">
            Mật khẩu chung cho tất cả tài khoản demo: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">Password@123</code>
          </p>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-brand-600 font-bold hover:underline">
            Đăng ký tài khoản mới
          </Link>
        </p>
      </div>
    </div>
  );
};
