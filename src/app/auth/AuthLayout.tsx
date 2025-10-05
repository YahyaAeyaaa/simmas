import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';
import ButtonIcon from '@/components/form/ButtonIcon'

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  type: 'login' | 'register';
}

export const AuthLayout = ({ children, title, subtitle, type }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center relative overflow-hidden max-w-full">
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-120 h-auto rounded-2xl p-5">
          <h1 className="font-Poppins font-semibold text-2xl text-center">
            {title}
          </h1>
          <p className="font-Poppins text-slate-500 text-center mb-4">
            {subtitle}
          </p>
          
          {children}
          
          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-1 border-gray-300" />
            <span className="px-4 text-sm text-gray-500">
              Atau {type === 'login' ? 'Login' : 'Register'} Dengan
            </span>
            <hr className="flex-1 border-gray-300" />
          </div>
          
          {/* Social Login Buttons */}
          <div className="flex justify-center gap-3 items-center mb-8">
            <ButtonIcon />
          </div>
          
          {/* Toggle Link */}
          <p className="text-sm text-center">
            {type === 'login' ? (
              <>
                Belum punya akun?{" "}
                <Link href="/auth/register" className="text-blue-500 cursor-pointer">
                  Daftar
                </Link>
              </>
            ) : (
              <>
                Sudah punya akun?{" "}
                <Link href="/auth/login" className="text-blue-500 cursor-pointer">
                  Login
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
      
      {/* Decorative circles */}
      <div className="w-1/2 relative md:flex items-center left-20 hidden">
        <div className="bg-blue-100 w-350 h-350 absolute rounded-full flex items-center justify-center">
          <div className="bg-blue-200 w-300 h-300 rounded-full flex items-center justify-center">
            <div className="bg-blue-300 w-250 h-250 rounded-full">
              <Image 
                src="/images/Hero/gmbr.png" 
                alt="Decoration" 
                width={700}
                height={200}
                className="relative flex items-center right-30 top-65"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};