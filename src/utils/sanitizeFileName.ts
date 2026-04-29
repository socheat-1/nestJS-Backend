// utils/file.utils.ts (optional) or at top of your controller
export function sanitizeFileName(name: string): string {
  // Replace unsafe characters with underscore and lowercase everything
  return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}