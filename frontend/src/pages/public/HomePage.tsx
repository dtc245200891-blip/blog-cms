import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Post, Category } from '../../types';
import { PostCard } from '../../components/posts/PostCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FolderOpen,
  Award,
  Layers,
  Code2,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [pinnedPosts, setPinnedPosts] = useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [postsRes, catsRes] = await Promise.all([
          api.get('/posts', { params: { limit: 12, sort: 'latest' } }),
          api.get('/categories'),
        ]);

        const allPosts: Post[] = postsRes.data.data;
        setPinnedPosts(allPosts.filter((p) => p.isPinned));
        setLatestPosts(allPosts);
        setCategories(catsRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredPosts =
    selectedCategory === 'all'
      ? latestPosts
      : latestPosts.filter((p) => p.category?.slug === selectedCategory);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-900 via-brand-950 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(12,141,231,0.18),transparent_50%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            {/* Project Pill Badge */}
            <div className="inline-flex items-center space-x-2 bg-brand-500/10 border border-brand-400/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-300 mb-6 backdrop-blur-xs">
              <GraduationCap className="w-4 h-4 text-brand-400" />
              <span>ĐỒ ÁN MÔN HỌC CNTT K23L — ĐẠI HỌC CNTT & TRUYỀN THÔNG (ICTU)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6">
              Hệ thống Blog & Xuất bản Nội dung{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-sky-300">
                Chuyên Nghiệp
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl font-normal">
              Nền tảng CMS hoàn chỉnh được thiết kế và lập trình bởi sinh viên{' '}
              <strong className="text-white font-semibold">Vũ Trọng Nghĩa</strong>, dưới sự hướng dẫn
              của <strong className="text-white font-semibold">GV. Vũ Văn Diện</strong>. Hỗ trợ đầy đủ
              quy trình duyệt bài, phân quyền RBAC 4 cấp, trình soạn thảo phong phú và kiểm thử tự động.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/posts"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl shadow-lg shadow-brand-600/30 transition transform hover:-translate-y-0.5"
              >
                <span>Khám phá bài viết</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/15 backdrop-blur-xs transition"
              >
                <span>Đăng nhập demo</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured / Pinned Posts Section */}
      {pinnedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 mb-6">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Bài viết nổi bật & Đã ghim
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pinnedPosts.slice(0, 2).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Category Filter Pills & Latest Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Bài viết mới nhất
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Khám phá các góc nhìn công nghệ, học thuật và tin tức mới nhất từ ICTU
            </p>
          </div>

          {/* Category Filter Bar */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition shrink-0 ${
                  selectedCategory === cat.slug
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <LoadingSpinner text="Đang tải danh sách bài viết..." />
        ) : filteredPosts.length === 0 ? (
          <EmptyState
            title="Không tìm thấy bài viết"
            description="Chưa có bài viết nào trong danh mục đã chọn."
            actionText="Xem tất cả bài viết"
            onAction={() => setSelectedCategory('all')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/posts"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-brand-300 transition shadow-xs"
          >
            <span>Xem thêm tất cả bài viết</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Explore Categories Showcase */}
      <section className="bg-slate-100/70 py-12 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Chủ đề & Danh mục Chuyên môn
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Phân loại bài viết khoa học theo từng lĩnh vực đào tạo tại ICTU
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.slug}`}
                className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-brand-400 hover:shadow-md transition duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-2">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {cat.description || 'Khám phá các bài viết trong danh mục này...'}
                </p>
                <div className="flex items-center justify-between text-xs font-semibold text-brand-600">
                  <span>{cat._count?.posts || 0} bài viết đã xuất bản</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
