import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  FileText,
  Clock,
  CheckCircle,
  Eye,
  MessageSquare,
  Users,
  AlertCircle,
  TrendingUp,
  ShieldAlert,
  Activity,
  ExternalLink,
  Server,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#0c8de7', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b'];

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        const res = await api.get('/dashboard/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Đang tải dữ liệu thống kê tổng hợp..." />;
  }

  const { cards, topPosts, categoryChartData, recentLogs } = stats || {
    cards: {},
    topPosts: [],
    categoryChartData: [],
    recentLogs: [],
  };

  const metricCards = [
    {
      title: 'Tổng số bài viết',
      value: cards.totalPosts || 0,
      icon: FileText,
      color: 'bg-blue-500 text-white',
      badge: `${cards.publishedPosts || 0} đã xuất bản`,
    },
    {
      title: 'Bài viết chờ duyệt',
      value: cards.pendingPosts || 0,
      icon: Clock,
      color: 'bg-amber-500 text-white',
      badge: 'Cần kiểm duyệt',
    },
    {
      title: 'Tổng bình luận',
      value: cards.totalComments || 0,
      icon: MessageSquare,
      color: 'bg-emerald-500 text-white',
      badge: `${cards.pendingComments || 0} chờ duyệt`,
    },
    {
      title: 'Tổng lượt xem bài',
      value: cards.totalViews || 0,
      icon: Eye,
      color: 'bg-indigo-500 text-white',
      badge: 'Lượt xem thực tế',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-brand-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
            Bảng điều khiển quản trị
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Xin chào, {user?.fullName}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl">
            Vai trò hiện tại:{' '}
            <span className="font-bold text-brand-300">{user?.role}</span>. Dưới đây là các chỉ số
            hoạt động và nội dung thời gian thực của hệ thống ICTU Blog/CMS.
          </p>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold rounded-xl transition shadow-sm shrink-0"
        >
          <span>+ Viết bài mới</span>
        </Link>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">{m.title}</p>
                <p className="text-2xl font-black text-slate-900">{m.value}</p>
                <span className="inline-block mt-2 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                  {m.badge}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.color} shadow-sm`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* DevOps & System Monitoring Card (Grafana & Prometheus) */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-indigo-900/50 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Giám sát Hệ thống Trực tiếp
              </span>
              <span className="text-xs text-slate-400 font-mono">Port 3001</span>
            </div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              Grafana & Prometheus Monitoring Dashboard
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Thu thập và trực quan hóa toàn bộ chỉ số hiệu năng: RPS (Requests/sec), thời gian phản hồi (p95 latency), mã HTTP (2xx, 4xx, 5xx), bộ nhớ RAM Heap và % CPU của máy chủ Node.js.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="http://localhost:5000/api/v1/metrics"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Server className="w-3.5 h-3.5 text-blue-400" />
              <span>API Metrics RAW</span>
            </a>
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition"
            >
              <span>Mở Grafana Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart: Phân bố bài viết theo danh mục */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900">
              Số lượng bài viết theo Danh mục
            </h3>
            <span className="text-xs text-slate-500">Dữ liệu từ database thực</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#0c8de7" radius={[6, 6, 0, 0]} name="Số bài viết" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 bài viết nhiều lượt xem nhất */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-4 h-4 text-brand-600" />
            <h3 className="text-base font-bold text-slate-900">Top bài viết xem nhiều</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {topPosts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Chưa có bài viết nào.</p>
            ) : (
              topPosts.map((p: any, i: number) => (
                <div key={p.id} className="py-3 flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 overflow-hidden">
                    <Link
                      to={`/posts/${p.slug}`}
                      target="_blank"
                      className="text-xs font-bold text-slate-800 hover:text-brand-600 line-clamp-1 block"
                    >
                      {p.title}
                    </Link>
                    <span className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{p.viewsCount} lượt xem</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Nhật ký hoạt động gần đây (Audit Log preview) */}
      {recentLogs && recentLogs.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-brand-600" />
              <h3 className="text-base font-bold text-slate-900">
                Nhật ký hoạt động hệ thống gần đây
              </h3>
            </div>
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin/audit-logs"
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                Xem toàn bộ nhật ký →
              </Link>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Thời gian</th>
                  <th className="py-2.5 px-3">Người thực hiện</th>
                  <th className="py-2.5 px-3">Hành động</th>
                  <th className="py-2.5 px-3">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {log.user ? `${log.user.fullName} (${log.user.role})` : 'Hệ thống'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-md truncate">
                      {log.details || 'Không có mô tả'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
