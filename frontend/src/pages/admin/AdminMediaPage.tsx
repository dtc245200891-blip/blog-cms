import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MediaItem } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { Image as ImageIcon, Upload, Copy, Check, Trash2 } from 'lucide-react';

export const AdminMediaPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadMedia();
  }, [page]);

  const loadMedia = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/media', { params: { page, limit: 12 } });
      setMediaList(res.data.data);
      setTotalPages(res.data.meta.totalPages);
      setTotal(res.data.meta.total);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      loadMedia();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể tải tệp lên.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = (item: MediaItem) => {
    const fullUrl = `${window.location.origin}${item.url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (item: MediaItem) => {
    if (!window.confirm(`Xác nhận xóa tệp "${item.originalName}"?`)) return;
    try {
      await api.delete(`/media/${item.id}`);
      loadMedia();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể xóa tệp.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Thư viện Media</h2>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý các tệp hình ảnh tải lên hệ thống ({total} tệp)
          </p>
        </div>

        <label className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer shrink-0">
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'Đang tải lên...' : 'Tải ảnh mới'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Đang tải thư viện media..." />
      ) : mediaList.length === 0 ? (
        <EmptyState
          title="Chưa có tệp nào"
          description="Thư viện tệp đang trống. Hãy bấm 'Tải ảnh mới' để tải lên các hình ảnh bài viết."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {mediaList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs group flex flex-col justify-between"
              >
                <div className="aspect-square bg-slate-100 overflow-hidden relative">
                  <img
                    src={item.url}
                    alt={item.originalName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white">
                    {formatFileSize(item.size)}
                  </span>
                </div>

                <div className="p-3">
                  <p className="text-xs font-semibold text-slate-800 truncate mb-1" title={item.originalName}>
                    {item.originalName}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(item)}
                      className="inline-flex items-center space-x-1 text-[11px] font-bold text-brand-600 hover:text-brand-700 transition"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-green-600">Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy link</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded transition"
                      title="Xóa tệp"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}
    </div>
  );
};
