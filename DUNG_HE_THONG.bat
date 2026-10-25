@echo off
chcp 65001 > nul
title Dung He Thong Blog/CMS - ICTU
color 0c

echo =======================================================================
echo    ĐANG DỪNG HỆ THỐNG BLOG/CMS (VŨ TRỌNG NGHĨA - ICTU)...
echo =======================================================================
echo.
echo Đang tắt các tiến trình tại cổng 5000 (Backend), 5173 (Frontend), 27017 (MongoDB)...

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ports = @(5000, 5173, 27017); foreach ($p in $ports) { $conn = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue; if ($conn) { $pids = $conn.OwningProcess | Select-Object -Unique; foreach ($id in $pids) { if ($id -gt 4) { Stop-Process -Id $id -Force -ErrorAction SilentlyContinue; Write-Host ('[OK] Da giai phong cong ' + $p + ' (PID: ' + $id + ')') } } } }"

echo.
echo =======================================================================
echo    ✅ TOÀN BỘ HỆ THỐNG ĐÃ ĐƯỢC TẮT VÀ GIẢI PHÓNG CỔNG THÀNH CÔNG!
echo =======================================================================
echo.
pause
