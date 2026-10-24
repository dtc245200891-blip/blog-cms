const { buildExpandedReport } = require('./report_generator/build_report');

buildExpandedReport()
  .then(() => {
    console.log('🎉 Hoàn thành tạo báo cáo Word đồ án môn học ICTU!');
  })
  .catch((err) => {
    console.error('❌ Lỗi khi sinh báo cáo:', err);
    process.exit(1);
  });
