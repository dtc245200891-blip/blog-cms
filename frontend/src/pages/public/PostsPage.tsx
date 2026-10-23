import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Post, Category } from '../../types';
import { PostCard } from '../../components/posts/PostCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { Search, Filter, SlidersHorizontal, BookOpen } from 'lucide-react';

export const PostsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = (searchParams.get('sort') as 'latest' | 'views') || 'latest';

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [page, category, search, sort]);

  const loadCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/posts', {
        params: {
          page,
          limit: 9,
          categorySlug: category || undefined,
          search: search || undefined,
          sort,
        },
      });
      setPosts(res.data.data);
      setTotalPages(res.data.meta.totalPages);
      setTotalPosts(res.data.meta.total);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-3">
          <BookOpen className="w-8 h-8 text-brand-600" />
          <span>Tất cả bài viết</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Tổng hợp các bài viết học thuật, hướng dẫn công nghệ và hoạt động sinh viên ICTU ({totalPosts} bài)
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm theo tiêu đề hoặc nội dung..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Dropdown */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={category}
              onChange={(e) => updateParam('category', e.target.value)}
              className="text-xs font-medium py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-600">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="text-xs font-medium py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
            >
              <option value="latest">Mới nhất trước</option>
              <option value="views">Lượt xem nhiều nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner text="Đang tải dữ liệu bài viết..." />
      ) : posts.length === 0 ? (
        <EmptyState
          title="Không tìm thấy bài viết"
          description="Không có bài viết nào khớp với tiêu chí tìm kiếm hoặc bộ lọc hiện tại."
          actionText="Xóa bộ lọc"
          onAction={() => {
            setSearchInput('');
            setSearchParams(new URLSearchParams());
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => updateParam('page', p.toString())}
          />
        </>
      )}
    </div>
  );
};
