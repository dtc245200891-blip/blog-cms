import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Post } from '../../types';
import { PostCard } from '../../components/posts/PostCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Search } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function performSearch() {
      if (!query.trim()) {
        setPosts([]);
        return;
      }
      try {
        setIsLoading(true);
        const res = await api.get('/posts', {
          params: { search: query, limit: 30 },
        });
        setPosts(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    performSearch();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-2xl mx-auto mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Tìm kiếm bài viết</h1>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Nhập từ khóa tìm kiếm (tiêu đề, tóm tắt, nội dung)..."
            className="w-full pl-11 pr-24 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          <button
            type="submit"
            className="absolute right-2 top-2 px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg transition"
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      {query && (
        <div className="mb-8">
          <p className="text-sm text-slate-600">
            Kết quả tìm kiếm cho từ khóa: <strong className="text-slate-900">"{query}"</strong> ({posts.length} bài viết)
          </p>
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner text="Đang tìm kiếm..." />
      ) : query && posts.length === 0 ? (
        <EmptyState
          title="Không có kết quả phù hợp"
          description={`Không tìm thấy bài viết nào chứa từ khóa "${query}". Hãy thử tìm kiếm bằng từ khóa khác.`}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
