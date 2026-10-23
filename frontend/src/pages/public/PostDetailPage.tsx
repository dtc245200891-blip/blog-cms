import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Post } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { CommentSection } from '../../components/posts/CommentSection';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Eye,
  Bookmark,
  Share2,
  ArrowLeft,
  Tag,
  Clock,
  User,
  Check,
} from 'lucide-react';

export const PostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        setIsLoading(true);
        const res = await api.get(`/posts/detail/${slug}`);
        setPost(res.data.data);
        setIsBookmarked(res.data.data.isBookmarked || false);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để lưu bài viết.');
      return;
    }
    if (!post) return;

    try {
      const res = await api.post(`/posts/${post.id}/bookmark`);
      setIsBookmarked(res.data.data.bookmarked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner text="Đang tải nội dung bài viết..." />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy bài viết</h2>
        <p className="text-slate-500 mb-6">Bài viết không tồn tại hoặc đã bị gỡ xuống.</p>
        <Link
          to="/posts"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách bài viết</span>
        </Link>
      </div>
    );
  }

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
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Link
        to="/posts"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Tất cả bài viết</span>
      </Link>

      {/* Category Pill */}
      {post.category && (
        <div className="mb-4">
          <Link
            to={`/categories/${post.category.slug}`}
            className="inline-block bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold px-3 py-1 rounded-full transition"
          >
            {post.category.name}
          </Link>
        </div>
      )}

      {/* Main Title */}
      <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
        {post.title}
      </h1>

      {/* Author and Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 mb-8">
        <div className="flex items-center space-x-3">
          <img
            src={
              post.author.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
            }
            alt={post.author.fullName}
            className="w-11 h-11 rounded-full object-cover border border-slate-200"
          />
          <div>
            <Link
              to={`/authors/${post.author.id}`}
              className="font-bold text-sm text-slate-900 hover:text-brand-600 transition block"
            >
              {post.author.fullName}
            </Link>
            <div className="flex items-center space-x-3 text-xs text-slate-600 mt-0.5">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{post.viewsCount} lượt xem</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons (Bookmark, Share) */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleBookmark}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
              isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-600' : ''}`} />
            <span>{isBookmarked ? 'Đã lưu' : 'Lưu bài'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Đã sao chép liên kết' : 'Chia sẻ'}</span>
          </button>
        </div>
      </div>

      {/* Excerpt Lead */}
      {post.excerpt && (
        <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-brand-500 text-slate-700 text-base leading-relaxed italic mb-8 font-serif">
          {post.excerpt}
        </div>
      )}

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="aspect-video w-full rounded-2xl overflow-hidden mb-8 shadow-sm bg-slate-100">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Body Content */}
      <div
        className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-base"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags section */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
            <Tag className="w-3.5 h-3.5" />
            <span>Thẻ:</span>
          </span>
          {post.tags.map((t) => (
            <Link
              key={t.id}
              to={`/tags/${t.slug}`}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-md transition"
            >
              #{t.name}
            </Link>
          ))}
        </div>
      )}

      {/* Author Bio Box */}
      <div className="mt-8 p-6 bg-slate-100/70 rounded-2xl border border-slate-200 flex items-center space-x-4">
        <img
          src={
            post.author.avatarUrl ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'
          }
          alt={post.author.fullName}
          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
        />
        <div>
          <h4 className="font-bold text-slate-900">{post.author.fullName}</h4>
          <p className="text-xs text-slate-600 mt-1">
            {post.author.bio || 'Tác giả nội dung tại hệ thống Blog/CMS ICTU.'}
          </p>
        </div>
      </div>

      {/* Comments Section */}
      <CommentSection postId={post.id} allowComments={post.allowComments} />

      {/* Related Posts */}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <div className="mt-16 pt-8 border-t border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Bài viết cùng chủ đề</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {post.relatedPosts.map((rel) => (
              <Link
                key={rel.id}
                to={`/posts/${rel.slug}`}
                className="group flex space-x-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-brand-400 hover:shadow-xs transition"
              >
                <img
                  src={rel.featuredImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300'}
                  alt={rel.title}
                  className="w-20 h-20 rounded-lg object-cover group-hover:scale-105 transition shrink-0"
                />
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-brand-600 line-clamp-2 leading-snug">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2">
                    {rel.publishedAt ? new Date(rel.publishedAt).toLocaleDateString('vi-VN') : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
