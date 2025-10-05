'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/form/input';
import { Button } from '@/components/form/button';
import { AuthLayout } from '@/app/auth/AuthLayout';

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ 
      ...prev, 
      [e.target.name]: e.target.value 
    }));
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Basic client-side validation
    if (!formData.email || !formData.password) {
      setError('Email dan password wajib diisi');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'same-origin', // ensure cookies from same origin are handled
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Map server responses to friendly messages
        if (res.status === 400) setError(data?.message ?? 'Input tidak valid');
        else if (res.status === 401) setError(data?.message ?? 'Email atau password salah');
        else setError(data?.message ?? 'Terjadi kesalahan pada server');
        return;
      } 

      // Success: server should return user object (and set HttpOnly cookie)
      const user = data?.user;
      const role = user?.role;

      if (role === 'admin') router.push('/admin/dashboard');
      else if (role === 'guru') router.push('/guru/dashboard');
      else if (role === 'siswa') router.push('/siswa/dashboard');
      else {
        router.push('/');
      }
    } catch (err) {
      console.error('Login error', err);
      setError('Gagal terhubung ke server. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Selamat Datang Kembali!" 
      subtitle="Masuk ke akun Anda"
      type="login"
    >
      <form onSubmit={handleLogin} className="space-y-3">
        <Input 
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <Input 
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
          autoComplete="current-password"
        />
        <p className="text-blue-500 text-right mb-2 cursor-pointer">
          Lupa Password?
        </p>

        {error && (
          <div className="text-red-700 px-4 mb-1 text-sm">
            {error}
          </div>
        )}

        <Button 
          text={loading ? "Loading..." : "Login"} 
          type="submit"
          className="w-full rounded-2xl p-3 text-white bg-blue-500 hover:bg-blue-600 transition-all duration-200"
          disabled={loading}
        />
      </form>
    </AuthLayout>
  );
}
