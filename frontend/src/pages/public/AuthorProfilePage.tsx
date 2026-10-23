import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { User, Post } from '../../types';
import { PostCard } from '../../components/posts/PostCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ArrowLeft, User as UserIcon, Calendar, BookOpen } from 'lucide-react';

export const AuthorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAuthor() {
      try {
        setIsLoading(true);
        const [userRes, postsRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get('/posts', { params: { authorId: id, limit: 30 } }),
        ]);
        setAuthor(userRes.data.data);
        setPosts(postsRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) {
      loadAuthor();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner text="Đang tải thông tin tác giả..." />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy tác giả</h2>
        <Link to="/posts" className="text-brand-600 font-medium text-sm mt-4 inline-block">
          Quay lại danh sách bài viết
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/posts"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Tất cả bài viết</span>
      </Link>

      {/* Author Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs mb-10 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
        <img
          src={
            author.avatarUrl ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          }
          alt={author.fullName}
          className="w-24 h-24 rounded-full object-cover border-4 border-brand-50 shadow-sm"
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
            <h1 className="text-2xl font-bold text-slate-900">{author.fullName}</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              {author.role}
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl mb-4">
            {author.bio || 'Tác giả nội dung tại nền tảng Blog/CMS ICTU.'}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                Thành viên từ:{' '}
                {new Date(author.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </span>
            <span className="flex items-center space-x-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{posts.length} bài viết đã xuất bản</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Bài viết đã xuất bản bởi {author.fullName}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
