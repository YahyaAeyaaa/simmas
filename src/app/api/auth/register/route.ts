// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { normalizeRole } from '@/app/lib/utils/role';
import { isValidEmail, isStrongPassword } from '@/app/lib/auth/validators';
import { registerUser } from '@/app/service/userService';

type Body = {
  name?: string;
  email?: string;
  password?: string;
  role?: string; // from client could be 'user' or 'guru'
  // password_confirmation may be included by client but we ignore it
};

function isObjectWithCode(x: unknown): x is { code: string } {
  return typeof x === 'object' && x !== null && 'code' in x && typeof (x as { [k: string]: unknown }).code === 'string';
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();

    if (!raw || typeof raw !== 'object') {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    // Cast only after basic runtime check
    const body = raw as Body;

    const name = (body.name || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const password = (body.password || '');
    const roleRaw = body.role;

    if (!name) return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    if (!email || !isValidEmail(email)) return NextResponse.json({ message: 'Valid email is required' }, { status: 400 });
    if (!password || !isStrongPassword(password)) return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 });

    const role = normalizeRole(roleRaw);
    if (!role) return NextResponse.json({ message: 'Invalid role' }, { status: 400 });

    const user = await registerUser({
      name,
      email,
      password,
      role,
    });

    return NextResponse.json({ message: 'User created', user }, { status: 201 });
  } catch (err: unknown) {
    // type-safe handling without `any`
    console.error('Register error', err);

    if (isObjectWithCode(err) && err.code === 'EMAIL_EXISTS') {
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
    }

    // If it's an Error instance, we can log message; otherwise generic
    if (err instanceof Error) {
      return NextResponse.json({ message: 'Internal Server Error', detail: process.env.NODE_ENV === 'development' ? err.message : undefined }, { status: 500 });
    }

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
