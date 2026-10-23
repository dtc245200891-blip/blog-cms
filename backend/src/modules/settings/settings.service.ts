import { prisma } from '../../config/prisma';

export class SettingsService {
  static async getSettings() {
    const list = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    for (const item of list) {
      map[item.key] = item.value;
    }
    return { list, map };
  }

  static async updateSettings(adminId: string, settingsMap: Record<string, string>) {
    const updates = Object.entries(settingsMap).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    await prisma.$transaction(updates);

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'UPDATE_SETTINGS',
        entity: 'SETTING',
        details: `Cập nhật cấu hình hệ thống: ${Object.keys(settingsMap).join(', ')}`,
      },
    });

    return this.getSettings();
  }
}
