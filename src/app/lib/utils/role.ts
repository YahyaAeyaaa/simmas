// role.ts
export type IncomingRole = 'user' | 'siswa' | 'guru' | 'admin';

export function normalizeRole(input?: string): 'admin' | 'siswa' | 'guru' | null {
  if (!input) return null;
  const r = input.toLowerCase();
  if (r === 'user' || r === 'siswa') return 'siswa';
  if (r === 'guru') return 'guru';
  if (r === 'admin') return 'admin';
  return null;
}