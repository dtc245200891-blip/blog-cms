const { spawn, execSync, exec } = require('child_process');
const path = require('path');
const net = require('net');

console.log('=======================================================================');
console.log('   HỆ THỐNG BLOG/CMS HOÀN CHỈNH - ICTU');
console.log('   Sinh viên thực hiện : Vũ Trọng Nghĩa (Lớp: CNTT K23L - DTC245200891)');
console.log('   Trường ĐH Công nghệ Thông tin & Truyền thông Thái Nguyên (ICTU)');
console.log('   Giảng viên hướng dẫn: ThS. Vũ Văn Diện');
console.log('   Cơ sở dữ liệu       : MongoDB 7.0 (NoSQL Replica Set)');
console.log('=======================================================================\n');

function checkPort(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(600);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function waitForPort(port, name, maxRetries = 60) {
  for (let i = 1; i <= maxRetries; i++) {
    const open = await checkPort(port);
    if (open) return true;
    process.stdout.write(`   ... đang chờ ${name} sẵn sàng trên cổng ${port} (lần ${i}/${maxRetries})...\r`);
    await new Promise((r) => setTimeout(r, 1200));
  }
  return false;
}

function openBrowser(url) {
  const start = process.platform === 'win32' ? 'start' : 'open';
  exec(`${start} ${url}`);
}

function cleanOldProcesses() {
  if (process.platform === 'win32') {
    try {
      execSync('taskkill /f /im mongod* >nul 2>&1', { stdio: 'ignore' });
    } catch {}
    try {
      execSync(
        'powershell -NoProfile -ExecutionPolicy Bypass -Command "$ports = @(5000, 5173); foreach ($p in $ports) { $conn = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue; if ($conn) { $pids = $conn.OwningProcess | Select-Object -Unique; foreach ($id in $pids) { if ($id -gt 4) { Stop-Process -Id $id -Force -ErrorAction SilentlyContinue } } } }"',
        { stdio: 'ignore' }
      );
    } catch {}
  }
}

async function main() {
  const rootDir = __dirname;
  const backendDir = path.join(rootDir, 'backend');
  const frontendDir = path.join(rootDir, 'frontend');

  // 1. Dọn dẹp tiến trình cũ
  console.log('[1/4] Đang dọn dẹp các cổng 5000, 5173 và tiến trình MongoDB cũ...');
  cleanOldProcesses();
  await new Promise((r) => setTimeout(r, 1500));

  // 2. Khởi động Backend
  console.log('[2/4] Đang khởi động Backend API & MongoDB 7.0...');
  const isWindows = process.platform === 'win32';
  const npmCmd = isWindows ? 'npm.cmd' : 'npm';

  const backendProc = spawn(npmCmd, ['run', 'dev'], {
    cwd: backendDir,
    stdio: 'inherit',
    shell: false,
  });

  // 3. Đợi Backend lắng nghe trên cổng 5000
  console.log('[3/4] Đang chờ Backend kết nối cơ sở dữ liệu MongoDB...');
  const backendReady = await waitForPort(5000, 'Backend API');
  if (!backendReady) {
    console.error('\n❌ Không thể kết nối Backend sau thời gian chờ. Vui lòng kiểm tra lại log.');
    process.exit(1);
  }
  console.log('\n   ✅ Backend API & MongoDB đã sẵn sàng trên cổng 5000!');

  // 4. Khởi động Frontend
  console.log('[4/4] Đang khởi động giao diện người dùng Frontend (React + Vite)...');
  const frontendProc = spawn(npmCmd, ['run', 'dev'], {
    cwd: frontendDir,
    stdio: 'inherit',
    shell: false,
  });

  const frontendReady = await waitForPort(5173, 'Frontend Vite');
  if (!frontendReady) {
    console.error('\n❌ Không thể kết nối Frontend sau thời gian chờ.');
    process.exit(1);
  }
  console.log('\n   ✅ Frontend đã sẵn sàng trên cổng 5173!');

  console.log('\n=======================================================================');
  console.log('   🎉 HỆ THỐNG ĐÃ SẴN SÀNG! ĐANG MỞ TRÌNH DUYỆT...');
  console.log('   🌐 Trang chủ Blog/CMS   : http://localhost:5173');
  console.log('   🔗 Backend API Endpoint : http://localhost:5000/api/v1');
  console.log('   🩺 Kiểm tra trạng thái  : http://localhost:5000/api/health');
  console.log('   --------------------------------------------------------------------');
  console.log('   🔑 THÔNG TIN TÀI KHOẢN ĐĂNG NHẬP (Mật khẩu chung: Password@123):');
  console.log('      1. Quản trị viên (Admin):    admin@ictu.edu.vn   (Username: admin)');
  console.log('      2. Biên tập viên (Editor):   editor@ictu.edu.vn  (Username: editor)');
  console.log('      3. Tác giả (Author):         author1@ictu.edu.vn (Username: author_nghia)');
  console.log('      4. Độc giả (Reader):         reader1@ictu.edu.vn (Username: reader_nam)');
  console.log('   --------------------------------------------------------------------');
  console.log('   👉 Nhấn tổ hợp phím Ctrl + C để dừng toàn bộ hệ thống.');
  console.log('=======================================================================\n');

  openBrowser('http://localhost:5173');

  const cleanup = () => {
    console.log('\n🛑 Đang tắt toàn bộ hệ thống Blog/CMS...');
    try { backendProc.kill(); } catch {}
    try { frontendProc.kill(); } catch {}
    cleanOldProcesses();
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

main().catch(console.error);
