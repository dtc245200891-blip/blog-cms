import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Tag } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Tags, Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

export const AdminTagsPage: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/tags');
      setTags(res.data.data);
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
        await api.patch(`/tags/${editingId}`, { name: name.trim() });
        setMessage('Cập nhật thẻ thành công!');
      } else {
        await api.post('/tags', { name: name.trim() });
        setMessage('Tạo thẻ mới thành công!');
      }
      setName('');
      setEditingId(null);
      loadTags();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra.');
    }
  };

  const handleEdit = (t: Tag) => {
    setEditingId(t.id);
    setName(t.name);
  };

  const handleDelete = async (tagId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thẻ này không?')) return;
    try {
      await api.delete(`/tags/${tagId}`);
      loadTags();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể xóa thẻ.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý thẻ (Tags)</h2>
        <p className="text-xs text-slate-500 mt-1">
          Quản lý các từ khóa gắn kèm bài viết để tăng khả năng tìm kiếm
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs h-fit">
          <div className="flex items-center space-x-2 text-brand-600 mb-4">
            <Plus className="w-5 h-5" />
            <h3 className="font-bold text-slate-900 text-sm">
              {editingId ? 'Chỉnh sửa thẻ' : 'Thêm thẻ mới'}
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tên thẻ *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Nextjs, Docker, AI"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
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
                  onClick={() => {
                    setEditingId(null);
                    setName('');
                  }}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Danh sách thẻ */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Danh sách thẻ hiện có</h3>
            <span className="text-xs text-slate-500">{tags.length} thẻ</span>
          </div>

          {isLoading ? (
            <LoadingSpinner text="Đang tải thẻ..." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Tên thẻ</th>
                    <th className="py-3 px-4">Đường dẫn (Slug)</th>
                    <th className="py-3 px-4">Số bài gắn thẻ</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tags.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-bold text-slate-800">#{t.name}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{t.slug}</td>
                      <td className="py-3 px-4 text-slate-700 font-semibold">
                        {t._count?.postTags || 0}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(t)}
                            className="p-1 text-slate-500 hover:text-brand-600 rounded"
                            title="Chỉnh sửa"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
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
