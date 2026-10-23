import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Category, Tag } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { TipTapEditor } from '../../components/posts/TipTapEditor';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Upload,
} from 'lucide-react';

export const AdminPostEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user, isAdmin, isEditor } = useAuth();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('DRAFT');
  const [isPinned, setIsPinned] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Upload image state
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function loadMeta() {
      try {
        const [catsRes, tagsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/tags'),
        ]);
        setCategories(catsRes.data.data);
        setTags(tagsRes.data.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadMeta();
  }, []);

  useEffect(() => {
    async function loadPostData() {
      if (!id) return;
      try {
        setIsLoading(true);
        // Lấy chi tiết bài viết từ endpoint quản trị
        const res = await api.get('/posts/manage', { params: { search: '' } });
        // Tìm bài viết theo id
        const found = res.data.data.find((p: any) => p.id === id);
        if (found) {
          setTitle(found.title);
          setExcerpt(found.excerpt || '');
          setContent(found.content);
          setFeaturedImage(found.featuredImage || '');
          setCategoryId(found.categoryId || '');
          setSelectedTagIds(found.tags?.map((t: any) => t.id) || []);
          setStatus(found.status);
          setIsPinned(found.isPinned || false);
          setAllowComments(found.allowComments !== false);
          setSeoTitle(found.seoTitle || '');
          setSeoDescription(found.seoDescription || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (isEditing) {
      loadPostData();
    }
  }, [id, isEditing]);

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFeaturedImage(res.data.data.url);
      alert('Đã tải ảnh lên và gắn làm ảnh đại diện bài viết!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể tải ảnh lên.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (targetStatus?: string) => {
    if (!title.trim()) {
      setError('Tiêu đề bài viết không được để trống.');
      return;
    }
    if (!content.trim()) {
      setError('Nội dung bài viết không được để trống.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setMessage(null);

      const postStatus = targetStatus || status;

      const payload = {
        title,
        excerpt: excerpt || null,
        content,
        featuredImage: featuredImage || null,
        categoryId: categoryId || null,
        tagIds: selectedTagIds,
        status: postStatus,
        isPinned,
        allowComments,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
      };

      if (isEditing) {
        await api.patch(`/posts/${id}`, payload);
        setMessage('Cập nhật bài viết thành công!');
      } else {
        const res = await api.post('/posts', payload);
        setMessage('Tạo bài viết mới thành công!');
        setTimeout(() => {
          navigate('/admin/posts');
        }, 1200);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu bài viết.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Đang tải dữ liệu bài viết..." />;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/posts"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách</span>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => handleSave('DRAFT')}
            disabled={isSaving}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition disabled:opacity-50"
          >
            Lưu bản nháp
          </button>

          {(isAdmin || isEditor) ? (
            <button
              type="button"
              onClick={() => handleSave('PUBLISHED')}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50 flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Đang lưu...' : 'Xuất bản ngay'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSave('PENDING')}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition disabled:opacity-50 flex items-center space-x-1.5"
            >
              <Send className="w-4 h-4" />
              <span>{isSaving ? 'Đang gửi...' : 'Gửi phê duyệt'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {isEditing ? 'Chỉnh sửa bài viết' : 'Soạn thảo bài viết mới'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Hỗ trợ trình soạn thảo phong phú TipTap, tải ảnh đại diện và tùy biến SEO
        </p>
      </div>

      {message && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Title */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Tiêu đề bài viết *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài viết sinh động, chuẩn SEO..."
                className="w-full p-3 text-base font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Mô tả ngắn (Tóm tắt mở đầu)
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                placeholder="Đoạn văn ngắn gọn (1-2 câu) giới thiệu nội dung chính..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* TipTap Rich Text Editor */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Nội dung bài viết *
            </label>
            <TipTapEditor content={content} onChange={(html) => setContent(html)} />
          </div>
        </div>

        {/* Sidebar Controls (1 column) */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <label className="block text-xs font-bold text-slate-800">
              Ảnh đại diện bài viết
            </label>
            {featuredImage ? (
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 relative group">
                <img
                  src={featuredImage}
                  alt="Ảnh đại diện"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFeaturedImage('')}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg text-xs hover:bg-black transition"
                >
                  Gỡ ảnh
                </button>
              </div>
            ) : (
              <div className="aspect-video w-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 text-center bg-slate-50">
                <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-[11px] text-slate-500">Chưa có ảnh đại diện</p>
              </div>
            )}

            <div className="space-y-2">
              <input
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="Hoặc dán URL ảnh (https://...)"
                className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none"
              />

              <label className="flex items-center justify-center space-x-2 w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Đang tải lên...' : 'Tải ảnh từ máy tính'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Chuyên mục
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2.5 text-xs font-medium rounded-xl border border-slate-300 bg-white focus:outline-none"
              >
                <option value="">Chọn danh mục phù hợp</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Thẻ từ khóa (Tags)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                {tags.map((t) => {
                  const isSelected = selectedTagIds.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelectedTagIds((prev) =>
                          isSelected ? prev.filter((id) => id !== t.id) : [...prev, t.id]
                        );
                      }}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                        isSelected
                          ? 'bg-brand-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      #{t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Post Settings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Tùy chọn hiển thị
            </h4>

            <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={allowComments}
                onChange={(e) => setAllowComments(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
              />
              <span>Cho phép độc giả gửi bình luận</span>
            </label>

            {(isAdmin || isEditor) && (
              <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span>Ghim bài viết lên đầu trang chủ</span>
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
