import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Comment, CommentStatus } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { MessageSquare, Check, X, AlertTriangle, Trash2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminCommentsPage: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
  }, [page, statusFilter, search]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/comments/manage', {
        params: {
          page,
          limit: 10,
          status: statusFilter || undefined,
          search: search || undefined,
        },
      });
      setComments(res.data.data);
      setTotalPages(res.data.meta.totalPages);
      setTotal(res.data.meta.total);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModerate = async (commentId: string, status: CommentStatus) => {
    try {
      setActionLoading(commentId);
      await api.patch(`/comments/${commentId}/moderate`, { status });
      loadComments();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này vĩnh viễn?')) return;
    try {
      setActionLoading(commentId);
      await api.delete(`/comments/${commentId}`);
      loadComments();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể xóa bình luận.');
    } finally {
      setActionLoading(null);
    }
  };

  const statusBadge = (status: CommentStatus) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">Đã duyệt</span>;
      case 'PENDING':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-pulse">Chờ duyệt</span>;
      case 'REJECTED':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">Từ chối</span>;
      case 'SPAM':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-800">Spam</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Kiểm duyệt bình luận</h2>
          <p className="text-xs text-slate-500 mt-1">
            Tổng cộng: {total} bình luận trong cơ sở dữ liệu
          </p>
        </div>
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
            placeholder="Tìm trong nội dung bình luận..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none w-full sm:w-auto"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ duyệt (PENDING)</option>
          <option value="APPROVED">Đã duyệt (APPROVED)</option>
          <option value="REJECTED">Từ chối (REJECTED)</option>
          <option value="SPAM">Spam (SPAM)</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Đang tải danh sách bình luận..." />
      ) : comments.length === 0 ? (
        <EmptyState
          title="Không có bình luận"
          description="Không tìm thấy bình luận nào phù hợp với bộ lọc hiện tại."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Tác giả</th>
                  <th className="py-3 px-4">Nội dung</th>
                  <th className="py-3 px-4">Bài viết liên quan</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Ngày gửi</th>
                  <th className="py-3 px-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comments.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {c.author.fullName}
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <p className="text-slate-700 line-clamp-2 leading-relaxed">{c.content}</p>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-brand-600 font-medium">
                      {c.post ? (
                        <Link to={`/posts/${c.post.slug}`} target="_blank" className="hover:underline">
                          {c.post.title}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{statusBadge(c.status)}</td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        {c.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleModerate(c.id, 'APPROVED')}
                            disabled={actionLoading === c.id}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                            title="Phê duyệt bình luận"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {c.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleModerate(c.id, 'REJECTED')}
                            disabled={actionLoading === c.id}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                            title="Từ chối hiển thị"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        {c.status !== 'SPAM' && (
                          <button
                            onClick={() => handleModerate(c.id, 'SPAM')}
                            disabled={actionLoading === c.id}
                            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded"
                            title="Đánh dấu Spam"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(c.id)}
                          disabled={actionLoading === c.id}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                          title="Xóa vĩnh viễn"
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
