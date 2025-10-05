import Image from 'next/image';

interface IconButtonProps {
  className?: string;
  onClick?: () => void;
}

const IconButton = ({ className = "", onClick }: IconButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className={`w-auto h-14 p-3 rounded-4xl flex gap-3 items-center justify-center cursor-pointer ${className}`}
      style={{ background: '#F5F8FE' }}
    >
      <Image 
        src="/images/Hero/google-removebg-preview.png" 
        alt="Google"
        width={24}
        height={24}
        className="object-contain"
      />
      <h1>Google</h1>
    </button>
  );
};

export default IconButton;