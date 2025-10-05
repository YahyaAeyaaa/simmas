// lib/auth/withAuth.ts
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/app/lib/auth/jwt';

type Role = 'admin' | 'guru' | 'siswa';

export type SessionUser = {
  userId: number;
  email: string;
  name: string;
  role: Role;
};

/**
 * Get current session from cookie
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('simmas_token')?.value;
  
  if (!token) return null;
  
  const decoded = verifyJwt<SessionUser>(token);
  return decoded;
}

/**
 * Require authentication and optionally check roles
 * @param allowedRoles - Array of allowed roles (e.g., ['admin'])
 * @returns SessionUser if authenticated and authorized
 * @throws Redirects to login or role dashboard if unauthorized
 */
export async function requireAuth(allowedRoles?: Role[]): Promise<SessionUser> {
  const session = await getSession();
  
  // Not logged in → redirect to login
  if (!session) {
    redirect('/auth/login');
  }
  
  // Role not allowed → redirect to their own dashboard
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    redirect(`/${session.role}/dashboard`);
  }
  
  return session;
}