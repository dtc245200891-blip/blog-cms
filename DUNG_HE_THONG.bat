@echo off
title Dung He Thong Blog/CMS - ICTU
color 0c

echo =======================================================================
echo    DANG DUNG HE THONG BLOG/CMS (VU TRONG NGHIA - ICTU)...
echo =======================================================================
echo.
echo Dang giai phong cac cong 5000 (Backend), 5173 (Frontend), 27017 (MongoDB)...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":27017" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

echo.
echo =======================================================================
echo    DA DUNG VA GIAI PHONG TOAN BO CONG MANG THANH CONG!
echo =======================================================================
echo.
pause
