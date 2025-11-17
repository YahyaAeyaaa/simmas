// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Endpoint untuk proses logout dengan metode POST
export async function POST(req: NextRequest) {
  try {
    // Buat response JSON berisi pesan sukses
    const res = NextResponse.json(
      { message: 'Logout successful' }, 
      { status: 200 }
    );

    // Hapus cookie 'simmas_token' dengan set cookie expired
    res.cookies.set('simmas_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 0, // Set maxAge ke 0 untuk hapus cookie
    });

    // Kirim response ke client
    return res;
  } catch (err) {
    // Jika ada error tidak terduga
    console.error('Logout error', err);
    
    // Kirim response error internal server (status 500)
    return NextResponse.json(
      { message: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

