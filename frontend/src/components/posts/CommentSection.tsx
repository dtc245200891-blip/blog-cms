import React, { useState, useEffect } from 'react';
import { Comment } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Send, Reply, Trash2, Edit2 } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
  allowComments: boolean;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  allowComments,
}) => {
  const { user, isAuthenticated, isAdmin, isEditor } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/comments/post/${postId}`);
      setComments(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      setMessage(null);
      const res = await api.post('/comments', {
        postId,
        content: newComment.trim(),
      });
      const created = res.data.data;
      if (created.status === 'APPROVED') {
        setComments([created, ...comments]);
        setMessage('Bình luận của bạn đã được đăng thành công.');
      } else {
        setMessage('Bình luận của bạn đã được gửi và đang chờ ban biên tập phê duyệt.');
      }
      setNewComment('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi gửi bình luận.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplyComment = async (parentId: string) => {
    if (!replyContent.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await api.post('/comments', {
        postId,
        content: replyContent.trim(),
        parentId,
      });
      const created = res.data.data;
      if (created.status === 'APPROVED') {
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: [...(c.replies || []), created] }
              : c
          )
        );
      } else {
        alert('Phản hồi của bạn đã được gửi và đang chờ duyệt.');
      }
      setReplyingTo(null);
      setReplyContent('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) =>
        prev
          .filter((c) => c.id !== commentId)
          .map((c) => ({
            ...c,
            replies: c.replies?.filter((r) => r.id !== commentId),
          }))
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể xóa bình luận.');
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-slate-200">
      <div className="flex items-center space-x-2 mb-6">
        <MessageSquare className="w-5 h-5 text-brand-600" />
        <h3 className="text-xl font-bold text-slate-900">
          Bình luận & Thảo luận ({comments.length})
        </h3>
      </div>

      {/* Thông báo gửi thành công */}
      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
          {message}
        </div>
      )}

      {/* Ô nhập bình luận */}
      {!allowComments ? (
        <div className="p-4 bg-slate-100 text-slate-500 rounded-xl text-center text-sm font-medium">
          Tác giả đã tắt tính năng bình luận cho bài viết này.
        </div>
      ) : isAuthenticated ? (
        <form onSubmit={handlePostComment} className="mb-8">
          <div className="flex items-start space-x-3">
            <img
              src={
                user?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'
              }
              alt={user?.fullName}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                placeholder="Chia sẻ quan điểm hoặc đặt câu hỏi cho tác giả..."
                className="w-full p-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                required
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi bình luận</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-sm text-slate-600 mb-8">
          Vui lòng{' '}
          <a href="/login" className="text-brand-600 font-semibold hover:underline">
            Đăng nhập
          </a>{' '}
          hoặc{' '}
          <a href="/register" className="text-brand-600 font-semibold hover:underline">
            Đăng ký tài khoản
          </a>{' '}
          để tham gia bình luận.
        </div>
      )}

      {/* Danh sách bình luận */}
      {isLoading ? (
        <p className="text-sm text-slate-400 text-center py-4">Đang tải bình luận...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-6 italic">
          Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ ý kiến!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <div className="flex items-start space-x-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <img
                  src={
                    comment.author.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'
                  }
                  alt={comment.author.fullName}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-slate-800">
                        {comment.author.fullName}
                      </span>
                      {comment.author.role !== 'READER' && (
                        <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                          {comment.author.role}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-600">
                      {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 mt-2 leading-relaxed whitespace-pre-line">
                    {comment.content}
                  </p>

                  <div className="flex items-center space-x-4 mt-3 text-xs text-slate-600 font-medium">
                    {isAuthenticated && (
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="flex items-center space-x-1 hover:text-brand-600 transition"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        <span>Trả lời</span>
                      </button>
                    )}

                    {(isAdmin || isEditor || user?.id === comment.authorId) && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="flex items-center space-x-1 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    )}
                  </div>

                  {/* Form trả lời */}
                  {replyingTo === comment.id && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Trả lời @${comment.author.fullName}...`}
                        rows={2}
                        className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          type="button"
                          onClick={() => setReplyingTo(null)}
                          className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReplyComment(comment.id)}
                          disabled={!replyContent.trim() || isSubmitting}
                          className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded"
                        >
                          Gửi phản hồi
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Danh sách phản hồi con (Replies) */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-8 sm:ml-12 space-y-2 border-l-2 border-brand-200 pl-4">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="flex items-start space-x-3 bg-slate-50/70 p-3 rounded-lg border border-slate-200"
                    >
                      <img
                        src={
                          reply.author.avatarUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'
                        }
                        alt={reply.author.fullName}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-800">
                              {reply.author.fullName}
                            </span>
                            {reply.author.role !== 'READER' && (
                              <span className="ml-1.5 text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-brand-50 text-brand-700">
                                {reply.author.role}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-600">
                            {new Date(reply.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed whitespace-pre-line">
                          {reply.content}
                        </p>
                        {(isAdmin || isEditor || user?.id === reply.authorId) && (
                          <button
                            onClick={() => handleDeleteComment(reply.id)}
                            className="text-[10px] text-red-500 hover:underline mt-1 block"
                          >
                            Xóa phản hồi
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
