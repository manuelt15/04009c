// Un producto cuenta como NUEVO durante sus primeros 30 días desde que se creó
export const NEW_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export function isNewProduct(createdAt: Date | string): boolean {
  return Date.now() - new Date(createdAt).getTime() < NEW_WINDOW_MS;
}
