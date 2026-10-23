import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Mail, MapPin, School, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Giới thiệu dự án & Tác giả */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                ICTU <span className="text-brand-400">Blog/CMS</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Hệ thống xuất bản và quản trị nội dung hoàn chỉnh phục vụ báo cáo Đồ án môn học
              ngành Công nghệ Thông tin, xây dựng với React, TypeScript, Node.js, Express và Prisma ORM.
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-slate-400">
              <div className="flex items-center space-x-2">
                <School className="w-4 h-4 text-brand-400" />
                <span>Trường Đại học Công nghệ Thông tin và Truyền thông – ĐH Thái Nguyên (ICTU)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-brand-400" />
                <span>
                  Sinh viên thực hiện:{' '}
                  <strong className="text-white font-semibold">Vũ Trọng Nghĩa</strong> — Lớp:{' '}
                  <span className="text-brand-400 font-semibold">CNTT K23L</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-brand-400" />
                <span>
                  Giảng viên hướng dẫn:{' '}
                  <strong className="text-white font-semibold">Vũ Văn Diện</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Liên kết nhanh */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Khám phá
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/posts" className="hover:text-white transition">
                  Tất cả bài viết
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition">
                  Danh mục bài viết
                </Link>
              </li>
              <li>
                <Link to="/saved-posts" className="hover:text-white transition">
                  Bài viết đã lưu
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Thông tin bảo vệ đồ án */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Thông tin đồ án
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Môn học: Phát triển Ứng dụng Web / Công nghệ Phần mềm
              <br />
              Năm học: 2026 - Học kỳ 1
              <br />
              Múi giờ hệ thống: Asia/Ho_Chi_Minh
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500">
              Mã nguồn đầy đủ có kiểm thử tự động, cơ sở dữ liệu thật và phân quyền RBAC 4 cấp.
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 ICTU Blog/CMS. Đồ án sinh viên Vũ Trọng Nghĩa (K23L).</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Xây dựng bằng tình yêu công nghệ tại</span>
            <span className="text-brand-400 font-semibold">Thái Nguyên</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
