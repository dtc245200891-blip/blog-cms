const path = require('path');
const fs = require('fs');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  AlignmentType,
  HeadingLevel,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  ShadingType,
  PageBreak,
} = require('docx');

// Màu sắc chủ đạo (ICTU Academic Navy & Slate)
const COLORS = {
  NAVY_PRIMARY: '03589F',
  NAVY_DARK: '074A83',
  SLATE_DARK: '1E293B',
  TEXT_BODY: '1E293B',
  TEXT_MUTED: '64748B',
  BORDER_TABLE: 'CBD5E1',
  BORDER_HEADER: '03589F',
  BG_HEADER: '03589F',
  BG_HEADER_LIGHT: 'E0EFFE',
  BG_ROW_ALT: 'F8FAFC',
  BG_CALLOUT_BLUE: 'F0F7FF',
  BG_CALLOUT_GREEN: 'F0FDF4',
  BG_CALLOUT_AMBER: 'FFFBEB',
  BORDER_CALLOUT_BLUE: '0284C7',
  BORDER_CALLOUT_GREEN: '059669',
  BORDER_CALLOUT_AMBER: 'D97706',
};

// Viền ô chuẩn cho bảng biểu
const cellBorders = {
  top: { style: BorderStyle.SINGLE, size: 4, color: COLORS.BORDER_TABLE },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.BORDER_TABLE },
  left: { style: BorderStyle.SINGLE, size: 4, color: COLORS.BORDER_TABLE },
  right: { style: BorderStyle.SINGLE, size: 4, color: COLORS.BORDER_TABLE },
};

const headerBorders = {
  top: { style: BorderStyle.SINGLE, size: 6, color: COLORS.BORDER_HEADER },
  bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.BORDER_HEADER },
  left: { style: BorderStyle.SINGLE, size: 6, color: COLORS.BORDER_HEADER },
  right: { style: BorderStyle.SINGLE, size: 6, color: COLORS.BORDER_HEADER },
};

// Đệm lề trong ô bảng (Cell padding)
const cellMargins = {
  top: 100,
  bottom: 100,
  left: 150,
  right: 150,
};

// Hàm tạo đoạn văn bản thông thường
function p(text, options = {}) {
  const children = [];
  if (options.runs && Array.isArray(options.runs)) {
    for (const r of options.runs) {
      children.push(
        new TextRun({
          text: r.text,
          font: 'Times New Roman',
          size: r.size || options.size || 26, // 13pt
          bold: r.bold || false,
          italics: r.italics || false,
          color: r.color || options.color || COLORS.TEXT_BODY,
        })
      );
    }
  } else if (text !== undefined && text !== null) {
    children.push(
      new TextRun({
        text: text,
        font: 'Times New Roman',
        size: options.size || 26,
        bold: options.bold || false,
        italics: options.italics || false,
        color: options.color || COLORS.TEXT_BODY,
      })
    );
  }

  return new Paragraph({
    alignment: options.align || AlignmentType.LEFT,
    spacing: {
      before: options.before !== undefined ? options.before : 0,
      after: options.after !== undefined ? options.after : 120,
      line: options.line || 276, // 1.15 line spacing
    },
    indent: options.indent ? { left: options.indent } : undefined,
    pageBreakBefore: options.pageBreakBefore || false,
    children: children,
  });
}

// Tiêu đề cấp 1 (Chương)
function h1(title, options = {}) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: options.align || AlignmentType.LEFT,
    spacing: { before: 320, after: 160 },
    pageBreakBefore: options.pageBreakBefore !== undefined ? options.pageBreakBefore : true,
    children: [
      new TextRun({
        text: title,
        font: 'Times New Roman',
        size: 32, // 16pt
        bold: true,
        color: COLORS.NAVY_PRIMARY,
      }),
    ],
  });
}

// Tiêu đề cấp 2 (Mục 1.1, 1.2, ...)
function h2(title, options = {}) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.LEFT,
    spacing: { before: 240, after: 120 },
    pageBreakBefore: options.pageBreakBefore || false,
    children: [
      new TextRun({
        text: title,
        font: 'Times New Roman',
        size: 28, // 14pt
        bold: true,
        color: COLORS.NAVY_DARK,
      }),
    ],
  });
}

// Tiêu đề cấp 3 (Mục 1.1.1, ...)
function h3(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    alignment: AlignmentType.LEFT,
    spacing: { before: 180, after: 80 },
    children: [
      new TextRun({
        text: title,
        font: 'Times New Roman',
        size: 26, // 13pt
        bold: true,
        color: COLORS.SLATE_DARK,
      }),
    ],
  });
}

// Tiêu đề cấp 4
function h4(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_4,
    alignment: AlignmentType.LEFT,
    spacing: { before: 140, after: 60 },
    children: [
      new TextRun({
        text: title,
        font: 'Times New Roman',
        size: 24, // 12pt
        bold: true,
        italics: true,
        color: COLORS.NAVY_DARK,
      }),
    ],
  });
}

// Danh sách dấu đầu dòng (Bullet)
function bullet(text, options = {}) {
  const indentLevel = options.level || 1;
  const leftIndent = indentLevel === 1 ? 540 : 1080;
  const symbol = indentLevel === 1 ? '• ' : '– ';

  const children = [];
  if (options.runs && Array.isArray(options.runs)) {
    children.push(
      new TextRun({
        text: symbol,
        font: 'Times New Roman',
        size: 26,
        bold: true,
        color: COLORS.NAVY_PRIMARY,
      })
    );
    for (const r of options.runs) {
      children.push(
        new TextRun({
          text: r.text,
          font: 'Times New Roman',
          size: r.size || 26,
          bold: r.bold || false,
          italics: r.italics || false,
          color: r.color || COLORS.TEXT_BODY,
        })
      );
    }
  } else {
    children.push(
      new TextRun({
        text: symbol,
        font: 'Times New Roman',
        size: 26,
        bold: true,
        color: COLORS.NAVY_PRIMARY,
      }),
      new TextRun({
        text: text,
        font: 'Times New Roman',
        size: 26,
        bold: options.bold || false,
        italics: options.italics || false,
        color: options.color || COLORS.TEXT_BODY,
      })
    );
  }

  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 40, after: 80, line: 276 },
    indent: { left: leftIndent, hanging: 240 },
    children: children,
  });
}

// Khối thông tin nổi bật (Callout Box)
function callout(title, lines, type = 'blue') {
  let borderColor = COLORS.BORDER_CALLOUT_BLUE;
  let bgColor = COLORS.BG_CALLOUT_BLUE;

  if (type === 'green') {
    borderColor = COLORS.BORDER_CALLOUT_GREEN;
    bgColor = COLORS.BG_CALLOUT_GREEN;
  } else if (type === 'amber') {
    borderColor = COLORS.BORDER_CALLOUT_AMBER;
    bgColor = COLORS.BG_CALLOUT_AMBER;
  }

  const paragraphs = [];
  if (title) {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 60, after: 80 },
        children: [
          new TextRun({
            text: title,
            font: 'Times New Roman',
            size: 26,
            bold: true,
            color: borderColor,
          }),
        ],
      })
    );
  }

  for (const line of lines) {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 40, after: 60, line: 260 },
        children: [
          new TextRun({
            text: line,
            font: 'Times New Roman',
            size: 24, // 12pt
            color: COLORS.SLATE_DARK,
          }),
        ],
      })
    );
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              left: { style: BorderStyle.SINGLE, size: 24, color: borderColor },
              top: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
            },
            margins: { top: 120, bottom: 120, left: 200, right: 160 },
            shading: { type: ShadingType.CLEAR, fill: bgColor },
            children: paragraphs,
          }),
        ],
      }),
    ],
  });
}

// Khối mã nguồn hoặc cấu hình kỹ thuật (Code Box)
function codeBox(codeLines) {
  const paragraphs = codeLines.map(
    (line) =>
      new Paragraph({
        spacing: { before: 20, after: 20, line: 240 },
        children: [
          new TextRun({
            text: line,
            font: 'Consolas',
            size: 20, // 10pt
            color: '0F172A',
          }),
        ],
      })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              left: { style: BorderStyle.SINGLE, size: 6, color: '94A3B8' },
              top: { style: BorderStyle.SINGLE, size: 6, color: '94A3B8' },
              right: { style: BorderStyle.SINGLE, size: 6, color: '94A3B8' },
              bottom: { style: BorderStyle.SINGLE, size: 6, color: '94A3B8' },
            },
            margins: { top: 140, bottom: 140, left: 180, right: 180 },
            shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
            children: paragraphs,
          }),
        ],
      }),
    ],
  });
}

// Hàm tạo bảng chuẩn mực chuyên nghiệp
function createTable(headers, rows, options = {}) {
  const colWidths = options.colWidths || null; // Mảng phần trăm hoặc giá trị

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // Dòng tiêu đề bảng
      new TableRow({
        tableHeader: true,
        children: headers.map((h, colIndex) => {
          const cellOpts = {
            borders: headerBorders,
            margins: cellMargins,
            shading: { type: ShadingType.CLEAR, fill: options.headerLight ? COLORS.BG_HEADER_LIGHT : COLORS.NAVY_PRIMARY },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 60, after: 60 },
                children: [
                  new TextRun({
                    text: h,
                    font: 'Times New Roman',
                    size: 24, // 12pt
                    bold: true,
                    color: options.headerLight ? COLORS.NAVY_PRIMARY : 'FFFFFF',
                  }),
                ],
              }),
            ],
          };

          if (colWidths && colWidths[colIndex]) {
            cellOpts.width = { size: colWidths[colIndex], type: WidthType.PERCENTAGE };
          }
          return new TableCell(cellOpts);
        }),
      }),

      // Các dòng dữ liệu
      ...rows.map((row, rowIndex) => {
        const isAlt = rowIndex % 2 === 1;
        return new TableRow({
          children: row.map((cellText, colIndex) => {
            const align =
              options.alignMap && options.alignMap[colIndex]
                ? options.alignMap[colIndex]
                : colIndex === 0 && row.length > 3
                ? AlignmentType.CENTER
                : colIndex === row.length - 1 && row.length > 4
                ? AlignmentType.CENTER
                : AlignmentType.LEFT;

            const cellOpts = {
              borders: cellBorders,
              margins: cellMargins,
              shading: isAlt ? { type: ShadingType.CLEAR, fill: COLORS.BG_ROW_ALT } : undefined,
              children: [
                new Paragraph({
                  alignment: align,
                  spacing: { before: 40, after: 40, line: 260 },
                  children: [
                    new TextRun({
                      text: cellText !== undefined && cellText !== null ? String(cellText) : '',
                      font: 'Times New Roman',
                      size: 22, // 11pt
                      color: COLORS.SLATE_DARK,
                    }),
                  ],
                }),
              ],
            };

            if (colWidths && colWidths[colIndex]) {
              cellOpts.width = { size: colWidths[colIndex], type: WidthType.PERCENTAGE };
            }
            return new TableCell(cellOpts);
          }),
        });
      }),
    ],
  });
}

module.exports = {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  AlignmentType,
  HeadingLevel,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  ShadingType,
  PageBreak,
  COLORS,
  p,
  h1,
  h2,
  h3,
  h4,
  bullet,
  callout,
  codeBox,
  createTable,
};
