import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Post, PostStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import {
  FileText,
  PlusCircle,
  Search,
  CheckCircle,
  XCircle,
  Send,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  Archive,
} from 'lucide-react';

export const AdminPostsPage: React.FC = () => {
  const { user, isAdmin, isEditor } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, [page, statusFilter, search]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/posts/manage', {
        params: {
          page,
          limit: 10,
          status: statusFilter || undefined,
          search: search || undefined,
        },
      });
      setPosts(res.data.data);
      setTotalPages(res.data.meta.totalPages);
      setTotal(res.data.meta.total);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForReview = async (postId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn gửi bài viết này để ban biên tập phê duyệt?')) return;
    try {
      setActionLoading(postId);
      await api.post(`/posts/${postId}/submit`);
      loadPosts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = async (postId: string) => {
    if (!window.confirm('Xác nhận phê duyệt và xuất bản bài viết này?')) return;
    try {
      setActionLoading(postId);
      await api.post(`/posts/${postId}/approve`);
      loadPosts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (postId: string) => {
    const reason = window.prompt('Nhập lý do từ chối bài viết để tác giả chỉnh sửa:');
    if (!reason) return;
    try {
      setActionLoading(postId);
      await api.post(`/posts/${postId}/reject`, { reason });
      loadPosts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Hành động này không thể hoàn tác. Bạn có chắc muốn xóa bài viết này?')) return;
    try {
      setActionLoading(postId);
      await api.delete(`/posts/${postId}`);
      loadPosts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể xóa bài viết.');
    } finally {
      setActionLoading(null);
    }
  };

  const statusBadge = (status: PostStatus, rejectionReason?: string | null) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">Đã xuất bản</span>;
      case 'PENDING':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-pulse">Chờ duyệt</span>;
      case 'DRAFT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">Bản nháp</span>;
      case 'REJECTED':
        return (
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 cursor-help"
            title={rejectionReason ? `Lý do: ${rejectionReason}` : 'Bị từ chối'}
          >
            Bị từ chối
          </span>
        );
      case 'SCHEDULED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">Đã lên lịch</span>;
      case 'ARCHIVED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-800">Lưu trữ</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý bài viết</h2>
          <p className="text-xs text-slate-500 mt-1">
            Tổng cộng: {total} bài viết trong hệ thống
          </p>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tạo bài viết mới</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo tiêu đề..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="DRAFT">Bản nháp (DRAFT)</option>
            <option value="PENDING">Chờ duyệt (PENDING)</option>
            <option value="PUBLISHED">Đã xuất bản (PUBLISHED)</option>
            <option value="REJECTED">Bị từ chối (REJECTED)</option>
            <option value="SCHEDULED">Đã lên lịch (SCHEDULED)</option>
            <option value="ARCHIVED">Lưu trữ (ARCHIVED)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner text="Đang tải dữ liệu bài viết..." />
      ) : posts.length === 0 ? (
        <EmptyState
          title="Không có bài viết"
          description="Không tìm thấy bài viết nào phù hợp với bộ lọc hiện tại."
          actionText="Tạo bài viết đầu tiên"
          onAction={() => window.location.assign('/admin/posts/new')}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Tiêu đề bài viết</th>
                  <th className="py-3.5 px-4">Tác giả</th>
                  <th className="py-3.5 px-4">Danh mục</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4">Lượt xem</th>
                  <th className="py-3.5 px-4">Cập nhật</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 truncate">{post.title}</p>
                      {post.rejectionReason && (
                        <p className="text-[11px] text-red-600 truncate mt-0.5">
                          Lý do từ chối: {post.rejectionReason}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {post.author.fullName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {post.category ? post.category.name : '—'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {statusBadge(post.status, post.rejectionReason)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {post.viewsCount}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(post.updatedAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* Xem trước nếu PUBLISHED */}
                        {post.status === 'PUBLISHED' && (
                          <Link
                            to={`/posts/${post.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-brand-600 rounded transition"
                            title="Xem trên trang chủ"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}

                        {/* Tác giả: Gửi duyệt (khi là DRAFT hoặc REJECTED) */}
                        {(post.status === 'DRAFT' || post.status === 'REJECTED') && (
                          <button
                            onClick={() => handleSubmitForReview(post.id)}
                            disabled={actionLoading === post.id}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[11px] font-bold shadow-xs transition"
                            title="Gửi bài để biên tập viên kiểm duyệt"
                          >
                            <Send className="w-3 h-3" />
                            <span>Gửi duyệt</span>
                          </button>
                        )}

                        {/* Biên tập viên / Admin: Phê duyệt bài chờ duyệt */}
                        {(isAdmin || isEditor) && post.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(post.id)}
                              disabled={actionLoading === post.id}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-[11px] font-bold shadow-xs transition"
                              title="Duyệt và xuất bản ngay"
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>Duyệt</span>
                            </button>
                            <button
                              onClick={() => handleReject(post.id)}
                              disabled={actionLoading === post.id}
                              className="inline-flex items-center space-x-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold shadow-xs transition"
                              title="Từ chối và yêu cầu sửa"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Từ chối</span>
                            </button>
                          </>
                        )}

                        {/* Chỉnh sửa */}
                        <Link
                          to={`/admin/posts/edit/${post.id}`}
                          className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded transition"
                          title="Chỉnh sửa nội dung"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        {/* Xóa */}
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={actionLoading === post.id}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                          title="Xóa bài viết"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
