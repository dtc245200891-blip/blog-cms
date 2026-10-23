import slugify from 'slugify';

export function generateSlug(text: string): string {
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd');

  return slugify(normalized, {
    lower: true,
    strict: true,
    trim: true,
  });
}
