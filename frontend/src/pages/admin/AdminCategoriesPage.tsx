import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Category } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { FolderTree, Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setError(null);
      setMessage(null);
      if (editingId) {
        await api.patch(`/categories/${editingId}`, {
          name: name.trim(),
          description: description.trim() || null,
          parentId: parentId || null,
        });
        setMessage('Cập nhật danh mục thành công!');
      } else {
        await api.post('/categories', {
          name: name.trim(),
          description: description.trim() || null,
          parentId: parentId || null,
        });
        setMessage('Tạo danh mục mới thành công!');
      }
      setName('');
      setDescription('');
      setParentId('');
      setEditingId(null);
      loadCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra.');
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description || '');
    setParentId(cat.parentId || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setParentId('');
  };

  const handleDelete = async (catId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) return;
    try {
      await api.delete(`/categories/${catId}`);
      loadCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể xóa danh mục.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý danh mục</h2>
        <p className="text-xs text-slate-500 mt-1">
          Phân cấp và cấu trúc danh mục bài viết cho toàn bộ website
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form thêm / sửa */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs h-fit">
          <div className="flex items-center space-x-2 text-brand-600 mb-4">
            <Plus className="w-5 h-5" />
            <h3 className="font-bold text-slate-900 text-sm">
              {editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            </h3>
          </div>

          {message && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 text-xs rounded-lg flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tên danh mục *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Khoa học Dữ liệu"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Mô tả nội dung chuyên mục này..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Danh mục cha</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none"
              >
                <option value="">Không có (Danh mục gốc)</option>
                {categories
                  .filter((c) => c.id !== editingId)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2 px-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Danh sách danh mục */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Danh sách danh mục hiện có</h3>
            <span className="text-xs text-slate-500">{categories.length} danh mục</span>
          </div>

          {isLoading ? (
            <LoadingSpinner text="Đang tải danh mục..." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Tên danh mục</th>
                    <th className="py-3 px-4">Đường dẫn (Slug)</th>
                    <th className="py-3 px-4">Số bài viết</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {cat.name}
                        {cat.parentId && (
                          <span className="ml-2 text-[10px] text-slate-400 font-normal">
                            (danh mục con)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{cat.slug}</td>
                      <td className="py-3 px-4 text-slate-700 font-bold">
                        {cat._count?.posts || 0}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="p-1 text-slate-500 hover:text-brand-600 rounded"
                            title="Chỉnh sửa"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded"
                            title="Xóa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
