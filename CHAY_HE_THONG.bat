@echo off
chcp 65001 > nul
title Khoi Dong He Thong Blog/CMS - ICTU Vu Trong Nghia
color 0b

echo =======================================================================
echo    HỆ THỐNG BLOG/CMS HOÀN CHỈNH - ICTU
echo    Sinh viên thực hiện: Vũ Trọng Nghĩa (Lớp: CNTT K23L - DTC245200891)
echo    Trường ĐH Công nghệ Thông tin & Truyền thông Thái Nguyên (ICTU)
echo    Giảng viên hướng dẫn: ThS. Vũ Văn Diện
echo    Cơ sở dữ liệu: MongoDB 7.0 (NoSQL Replica Set)
echo =======================================================================
echo.

echo [1/4] Đang kiểm tra và dọn dẹp các cổng 5000, 5173 (tránh lỗi xung đột)...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ports = @(5000, 5173); foreach ($p in $ports) { $conn = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue; if ($conn) { $pids = $conn.OwningProcess | Select-Object -Unique; foreach ($id in $pids) { if ($id -gt 4) { Stop-Process -Id $id -Force -ErrorAction SilentlyContinue } } } }"

echo [2/4] Đang khởi động Backend API & Máy chủ MongoDB 7.0...
start "Blog/CMS - BACKEND (Port 5000)" cmd /k "cd /d "%~dp0backend" && npm run dev"

echo [3/4] Đang đợi Backend và MongoDB sẵn sàng trong 6 giây...
timeout /t 6 /nobreak > nul

echo [4/4] Đang khởi động Frontend (React + Vite + Tailwind CSS)...
start "Blog/CMS - FRONTEND (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

timeout /t 3 /nobreak > nul

echo Đang mở trình duyệt vào hệ thống...
start http://localhost:5173

cls
color 0a
echo =======================================================================
echo    ✅ HỆ THỐNG BLOG/CMS ĐÃ KHỞI CHẠY THÀNH CÔNG!
echo =======================================================================
echo  - Giao diện người dùng:  http://localhost:5173
echo  - Máy chủ Backend API:   http://localhost:5000/api/v1
echo  - Kiểm tra trạng thái:   http://localhost:5000/api/health
echo -----------------------------------------------------------------------
echo  🔑 THÔNG TIN TÀI KHOẢN ĐĂNG NHẬP (Mật khẩu chung: Password@123):
echo    1. Quản trị viên (Admin):    admin@ictu.edu.vn   (Username: admin)
echo    2. Biên tập viên (Editor):   editor@ictu.edu.vn  (Username: editor)
echo    3. Tác giả (Author):         author1@ictu.edu.vn (Username: author_nghia)
echo    4. Độc giả (Reader):         reader1@ictu.edu.vn (Username: reader_nam)
echo -----------------------------------------------------------------------
echo  👉 Để dừng toàn bộ hệ thống khi dùng xong, hãy nhấp đúp file:
echo     DUNG_HE_THONG.bat
echo =======================================================================
echo.
pause
