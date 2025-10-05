// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { loginService, AuthError } from '@/app/service/authService';

// Endpoint untuk proses login dengan metode POST
export async function POST(req: NextRequest) {
  try {
    // Ambil data JSON dari body request (email & password)
    const body = await req.json();
    const email = (body?.email ?? '').toString();       // Pastikan email bertipe string
    const password = (body?.password ?? '').toString(); // Pastikan password bertipe string

    // Panggil service login untuk validasi user & dapatkan token JWT dan info user
    const { token, user } = await loginService(email, password);

    // Buat response JSON berisi pesan sukses dan data user
    const res = NextResponse.json({ message: 'Login successful', user }, { status: 200 });

    // Set cookie bernama 'simmas_token' berisi JWT
    // Cookie ini httpOnly agar tidak bisa diakses oleh JavaScript di client
    // Secure hanya aktif saat environment produksi agar cookie hanya lewat HTTPS
    // Path '/' agar cookie tersedia di semua route
    // SameSite 'lax' untuk mencegah CSRF tapi tetap memungkinkan navigasi normal
    // maxAge 7 hari (cookie kedaluwarsa dalam 7 hari)
    res.cookies.set('simmas_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 hari dalam detik
    });

    // Kirim response ke client
    return res;

  } catch (err) {
    // Jika errornya berasal dari autentikasi (misal email/password salah)
    if (err instanceof AuthError) {
      // Kembalikan response JSON dengan status 401 jika kredensial salah
      // atau status 400 untuk error lain yang berhubungan dengan autentikasi
      return NextResponse.json(
        { message: err.message }, 
        { status: err.code === 'INVALID_CREDENTIALS' ? 401 : 400 }
      );
    }

    // Jika error tidak terduga, tampilkan error di console server
    console.error('Login error', err);

    // Kirim response error internal server (status 500)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
