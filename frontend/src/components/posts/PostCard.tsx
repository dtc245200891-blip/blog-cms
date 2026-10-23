import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../types';
import { Eye, MessageSquare, Bookmark, Calendar, User } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const { isAuthenticated } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để lưu bài viết yêu thích.');
      return;
    }

    try {
      setIsSaving(true);
      const res = await api.post(`/posts/${post.id}/bookmark`);
      setIsBookmarked(res.data.data.bookmarked);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : new Date(post.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

  return (
    <article className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-brand-200 transition-all duration-300 flex flex-col h-full">
      {/* Featured Image */}
      <Link to={`/posts/${post.slug}`} className="relative block aspect-video overflow-hidden bg-slate-100">
        <img
          src={
            post.featuredImage ||
            'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'
          }
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {post.category && (
          <span className="absolute top-3 left-3 bg-brand-600/90 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
            {post.category.name}
          </span>
        )}
        {post.isPinned && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
            Ghim
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug mb-2">
            <Link to={`/posts/${post.slug}`}>{post.title}</Link>
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {post.excerpt || 'Đọc chi tiết bài viết trên cổng thông tin ICTU Blog/CMS...'}
          </p>
        </div>

        {/* Footer info */}
        <div>
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-600">
            {/* Author */}
            <div className="flex items-center space-x-2">
              <img
                src={
                  post.author.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'
                }
                alt={post.author.fullName}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="font-medium text-slate-700 truncate max-w-[100px]">
                {post.author.fullName}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center space-x-1 text-slate-600">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between mt-3 pt-2 text-xs text-slate-600">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{post.viewsCount}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{post._count?.comments || 0}</span>
              </span>
            </div>

            {/* Bookmark button */}
            <button
              onClick={handleToggleBookmark}
              disabled={isSaving}
              className={`p-1.5 rounded-full hover:bg-slate-100 transition ${
                isBookmarked ? 'text-amber-500 fill-amber-500' : 'text-slate-400'
              }`}
              title={isBookmarked ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
