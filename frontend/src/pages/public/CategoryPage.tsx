import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Post, Category } from '../../types';
import { PostCard } from '../../components/posts/PostCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { FolderOpen, ArrowLeft } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [catRes, postsRes] = await Promise.all([
          api.get(`/categories/${slug}`),
          api.get('/posts', { params: { categorySlug: slug, limit: 20 } }),
        ]);
        setCategory(catRes.data.data);
        setPosts(postsRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (slug) {
      loadData();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner text="Đang tải chuyên mục bài viết..." />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Danh mục không tồn tại</h2>
        <Link to="/categories" className="text-brand-600 font-medium text-sm mt-4 inline-block">
          Quay lại danh sách danh mục
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/categories"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Tất cả danh mục</span>
      </Link>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs mb-10">
        <div className="flex items-center space-x-3 text-brand-600 mb-2">
          <FolderOpen className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Chuyên mục</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">{category.name}</h1>
        {category.description && (
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {posts.length === 0 ? (
        <EmptyState
          title="Chưa có bài viết"
          description="Hiện chưa có bài viết nào được xuất bản trong danh mục này."
          actionText="Khám phá các chuyên mục khác"
          onAction={() => window.location.assign('/categories')}
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
