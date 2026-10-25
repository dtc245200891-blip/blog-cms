const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  Header,
  Footer,
  PageNumber,
  COLORS,
} = require('./helpers');

// Hàm xử lý sâu tệp OpenXML để triệt tiêu vĩnh viễn mọi dấu gạch đỏ chính tả trong Microsoft Word
async function disableAllSpellingUnderlines(buffer) {
  const zip = await JSZip.loadAsync(buffer);

  // 1. Cấu hình word/settings.xml: Bật cờ ẩn lỗi chính tả và ngữ pháp
  const settingsFile = zip.file('word/settings.xml');
  if (settingsFile) {
    let settings = await settingsFile.async('string');
    if (!settings.includes('hideSpellingErrors')) {
      settings = settings.replace(
        '</w:settings>',
        '<w:hideSpellingErrors/><w:hideGrammaticalErrors/><w:proofState w:spelling="clean" w:grammar="clean"/></w:settings>'
      );
      zip.file('word/settings.xml', settings);
    }
  }

  // 2. Cấu hình word/styles.xml: Thiết lập noProof mặc định cho toàn bộ tài liệu
  const stylesFile = zip.file('word/styles.xml');
  if (stylesFile) {
    let styles = await stylesFile.async('string');
    if (styles.includes('<w:rPrDefault/>')) {
      styles = styles.replace(
        '<w:rPrDefault/>',
        '<w:rPrDefault><w:rPr><w:noProof/><w:lang w:val="vi-VN"/></w:rPr></w:rPrDefault>'
      );
      zip.file('word/styles.xml', styles);
    } else if (styles.includes('<w:rPrDefault><w:rPr>')) {
      styles = styles.replace(
        '<w:rPrDefault><w:rPr>',
        '<w:rPrDefault><w:rPr><w:noProof/><w:lang w:val="vi-VN"/>'
      );
      zip.file('word/styles.xml', styles);
    }
  }

  return await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}

const { getFrontMatterChildren } = require('./section_front_matter');
const { getChapter1Children } = require('./section_chapter1');
const { getChapter2Children } = require('./section_chapter2');
const { getChapter3Children } = require('./section_chapter3');
const { getChapter4Children } = require('./section_chapter4');
const { getChapter5Children } = require('./section_chapter5');
const { getBackMatterChildren } = require('./section_back_matter');

async function buildExpandedReport() {
  console.log('🚀 [1/5] Bắt đầu khởi tạo dữ liệu báo cáo đồ án mở rộng ICTU...');

  // Đọc file ảnh logo ICTU
  const logoPath = path.resolve(__dirname, '..', 'ictu-logo.png');
  let logoData = null;
  if (fs.existsSync(logoPath)) {
    logoData = fs.readFileSync(logoPath);
    console.log(`✅ [2/5] Đã tải logo ICTU thành công (${logoData.length} bytes).`);
  } else {
    console.warn('⚠️ Không tìm thấy tệp ictu-logo.png tại:', logoPath);
  }

  // Thu thập toàn bộ nội dung Section 2
  console.log('📝 [3/5] Đang hợp nhất toàn bộ 5 chương và phụ lục chi tiết...');
  const mainSectionChildren = [
    ...getFrontMatterChildren(logoData),
    ...getChapter1Children(),
    ...getChapter2Children(),
    ...getChapter3Children(),
    ...getChapter4Children(),
    ...getChapter5Children(),
    ...getBackMatterChildren(),
  ];

  console.log(`📊 Tổng số phần tử văn bản trong tài liệu: ${mainSectionChildren.length}`);

  // Khởi tạo đối tượng tài liệu docx
  const doc = new Document({
    sections: [
      // ==========================================
      // SECTION 1: TRANG BÌA CHÍNH (COVER PAGE)
      // ==========================================
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1700, right: 1440 }, // A4 margins (Trái 3cm, trên/dưới/phải 2.5cm)
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: 'BỘ GIÁO DỤC VÀ ĐÀO TẠO — ĐẠI HỌC THÁI NGUYÊN',
                font: 'Times New Roman',
                size: 26,
                bold: true,
                color: '1E293B',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: 'TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG (ICTU)',
                font: 'Times New Roman',
                size: 26,
                bold: true,
                color: COLORS.NAVY_PRIMARY,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: 'KHOA CÔNG NGHỆ THÔNG TIN',
                font: 'Times New Roman',
                size: 24,
                bold: true,
                color: '475569',
              }),
            ],
          }),

          // Logo ICTU
          ...(logoData
            ? [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 120, after: 200 },
                  children: [
                    new ImageRun({
                      data: logoData,
                      transformation: { width: 140, height: 140 },
                    }),
                  ],
                }),
              ]
            : []),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 160, after: 120 },
            children: [
              new TextRun({
                text: 'BÁO CÁO ĐỒ ÁN MÔN HỌC',
                font: 'Times New Roman',
                size: 36, // 18pt
                bold: true,
                color: '0F172A',
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'MÔN HỌC: TRIỂN KHAI VÀ HỆ THỐNG PHẦN MỀM',
                font: 'Times New Roman',
                size: 28, // 14pt
                bold: true,
                color: '0284C7',
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 140, after: 60 },
            children: [
              new TextRun({
                text: 'ĐỀ TÀI:',
                font: 'Times New Roman',
                size: 28,
                bold: true,
                color: '475569',
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 360 },
            children: [
              new TextRun({
                text: 'XÂY DỰNG VÀ TRIỂN KHAI HỆ THỐNG BLOG / CONTENT MANAGEMENT SYSTEM (CMS) CHUYÊN NGHIỆP',
                font: 'Times New Roman',
                size: 32, // 16pt
                bold: true,
                color: COLORS.NAVY_PRIMARY,
              }),
            ],
          }),

          // Khung thông tin sinh viên và giảng viên
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 240, after: 80 },
            indent: { left: 1440 },
            children: [
              new TextRun({
                text: 'Giảng viên hướng dẫn:',
                font: 'Times New Roman',
                size: 26,
                bold: true,
              }),
              new TextRun({
                text: '   ThS. Vũ Văn Diện',
                font: 'Times New Roman',
                size: 26,
                bold: true,
                color: COLORS.NAVY_PRIMARY,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 80 },
            indent: { left: 1440 },
            children: [
              new TextRun({
                text: 'Sinh viên thực hiện:',
                font: 'Times New Roman',
                size: 26,
                bold: true,
              }),
              new TextRun({
                text: '       Vũ Trọng Nghĩa',
                font: 'Times New Roman',
                size: 26,
                bold: true,
                color: COLORS.NAVY_PRIMARY,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 80 },
            indent: { left: 1440 },
            children: [
              new TextRun({
                text: 'Mã số sinh viên:',
                font: 'Times New Roman',
                size: 26,
                bold: true,
              }),
              new TextRun({
                text: '           DTC245200891',
                font: 'Times New Roman',
                size: 26,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 80 },
            indent: { left: 1440 },
            children: [
              new TextRun({
                text: 'Lớp chuyên ngành:',
                font: 'Times New Roman',
                size: 26,
                bold: true,
              }),
              new TextRun({
                text: '         CNTT K23L (Khóa 23)',
                font: 'Times New Roman',
                size: 26,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 80 },
            indent: { left: 1440 },
            children: [
              new TextRun({
                text: 'Ngành đào tạo:',
                font: 'Times New Roman',
                size: 26,
                bold: true,
              }),
              new TextRun({
                text: '             Công nghệ Thông tin',
                font: 'Times New Roman',
                size: 26,
                bold: true,
              }),
            ],
          }),

          // Footer trang bìa
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400 },
            children: [
              new TextRun({
                text: 'THÁI NGUYÊN, THÁNG 10 NĂM 2026',
                font: 'Times New Roman',
                size: 26,
                bold: true,
                color: '475569',
              }),
            ],
          }),
        ],
      },

      // ==========================================
      // SECTION 2: TOÀN BỘ NỘI DUNG CHÍNH (ĐÁNH SỐ TRANG)
      // ==========================================
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1700, right: 1440 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: 'Trường Đại học CNTT & Truyền thông — Đồ án: Hệ thống Blog/CMS — SV: Vũ Trọng Nghĩa (DTC245200891)',
                    font: 'Times New Roman',
                    size: 18,
                    italics: true,
                    color: '64748B',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: 'Times New Roman',
                    size: 22,
                    bold: true,
                  }),
                ],
              }),
            ],
          }),
        },
        children: mainSectionChildren,
      },
    ],
  });

  // Đóng gói tệp docx
  console.log('📦 [4/5] Đang đóng gói tệp DOCX (Packer)...');
  const rawBuffer = await Packer.toBuffer(doc);

  console.log('🛡️ Đang áp dụng cơ chế triệt tiêu toàn bộ dấu gạch đỏ chính tả (noProof & hideSpellingErrors)...');
  const buffer = await disableAllSpellingUnderlines(rawBuffer);

  // Xuất file ra thư mục dự án
  const outputPath = path.resolve(__dirname, '..', '..', 'BAO_CAO_DO_AN_ICTU_VU_TRONG_NGHIA.docx');
  try {
    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ [5/5] ĐÃ TẠO THÀNH CÔNG TỆP BÁO CÁO MỞ RỘNG TẠI:\n   👉 ${outputPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
  } catch (err) {
    if (err.code === 'EBUSY') {
      const altPath = path.resolve(__dirname, '..', '..', 'BAO_CAO_DO_AN_ICTU_VU_TRONG_NGHIA_MONGODB.docx');
      fs.writeFileSync(altPath, buffer);
      console.log(`⚠️ Tệp gốc đang được mở trong Microsoft Word. Đã lưu bản báo cáo mới nhất tại:\n   👉 ${altPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
    } else {
      throw err;
    }
  }

  // Đồng thời sao chép đè vào tệp người dùng tải lên nếu tồn tại
  const uploadedDir = 'C:\\Users\\vtn08\\.gemini\\antigravity\\brain\\1f09fdd2-1fb2-4540-a5ee-14a46683e9b7\\.user_uploaded';
  if (fs.existsSync(uploadedDir)) {
    const files = fs.readdirSync(uploadedDir).filter((f) => f.endsWith('.docx'));
    for (const f of files) {
      const destFile = path.join(uploadedDir, f);
      fs.writeFileSync(destFile, buffer);
      console.log(`   👉 Đã cập nhật tệp Word trong .user_uploaded: ${destFile}`);
    }
  }

  return outputPath;
}

if (require.main === module) {
  buildExpandedReport()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Lỗi khi xây dựng báo cáo đồ án:', err);
      process.exit(1);
    });
}

module.exports = { buildExpandedReport };
