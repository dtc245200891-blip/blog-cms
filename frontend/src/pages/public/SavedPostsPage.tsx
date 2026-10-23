import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Post } from '../../types';
import { PostCard } from '../../components/posts/PostCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Bookmark, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SavedPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBookmarks() {
      try {
        setIsLoading(true);
        const res = await api.get('/posts/bookmarks/my-bookmarks');
        setPosts(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBookmarks();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link
          to="/posts"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tất cả bài viết</span>
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-3">
          <Bookmark className="w-7 h-7 text-amber-500 fill-amber-500" />
          <span>Bài viết đã lưu</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Danh sách các bài viết bạn đã đánh dấu để đọc lại
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Đang tải danh sách bài viết đã lưu..." />
      ) : posts.length === 0 ? (
        <EmptyState
          title="Chưa có bài viết đã lưu"
          description="Bạn chưa đánh dấu bài viết nào. Hãy bấm nút 'Lưu bài' ở các bài viết bạn thấy hữu ích."
          actionText="Khám phá bài viết ngay"
          onAction={() => window.location.assign('/posts')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={{ ...post, isBookmarked: true }} />
          ))}
        </div>
      )}
    </div>
  );
};
