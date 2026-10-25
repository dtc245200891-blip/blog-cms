@echo off
title He Thong Blog/CMS ICTU - Vu Trong Nghia
color 0b

echo =======================================================================
echo    HE THONG BLOG/CMS HOAN CHINH - ICTU
echo    Sinh vien thuc hien : Vu Trong Nghia (Lop: CNTT K23L - DTC245200891)
echo    Truong DH Cong nghe Thong tin va Truyen thong Thai Nguyen (ICTU)
echo    Giang vien huong dan: ThS. Vu Van Dien
echo    Co so du lieu       : MongoDB 7.0 (NoSQL Replica Set)
echo =======================================================================
echo.

echo [1/4] Kiem tra va giai phong cong 5000, 5173 (tranh xung dot)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

echo [2/4] Khoi dong Backend API va MongoDB 7.0...
cd /d "%~dp0backend"
start "Blog/CMS - BACKEND (Port 5000)" cmd /k "npm run dev"

echo [3/4] Cho Backend va MongoDB san sang trong 6 giay...
ping -n 7 127.0.0.1 >nul

echo [4/4] Khoi dong Frontend React va Vite...
cd /d "%~dp0frontend"
start "Blog/CMS - FRONTEND (Port 5173)" cmd /k "npm run dev"

ping -n 4 127.0.0.1 >nul

echo Dang mo trinh duyet...
start http://localhost:5173

cls
color 0a
echo =======================================================================
echo    HE THONG BLOG/CMS DA KHOI CHAY THANH CONG!
echo =======================================================================
echo  - Giao dien nguoi dung:  http://localhost:5173
echo  - May chu Backend API:   http://localhost:5000/api/v1
echo  - Kiem tra trang thai:   http://localhost:5000/api/health
echo -----------------------------------------------------------------------
echo  THONG TIN TAI KHOAN DANG NHAP (Mat khau chung: Password@123):
echo    1. Quan tri vien (Admin):    admin@ictu.edu.vn   (Username: admin)
echo    2. Bien tap vien (Editor):   editor@ictu.edu.vn  (Username: editor)
echo    3. Tac gia (Author):         author1@ictu.edu.vn (Username: author_nghia)
echo    4. Doc gia (Reader):         reader1@ictu.edu.vn (Username: reader_nam)
echo -----------------------------------------------------------------------
echo  De dung toan bo he thong, chay file: DUNG_HE_THONG.bat
echo =======================================================================
echo.
pause
