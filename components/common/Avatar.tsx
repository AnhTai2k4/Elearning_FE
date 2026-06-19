import React from 'react';

interface AvatarProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const getInitial = (name?: string) => {
  if (!name) return "U";
  const words = name.trim().split(" ");
  return words[words.length - 1].charAt(0).toUpperCase();
};

export default function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  const initial = getInitial(name);
  
  const sizeClasses = {
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-9 h-9 text-[13px]',
    lg: 'w-10 h-10 text-[16px]',
    xl: 'w-14 h-14 text-3xl'
  };

  return (
    <div 
      className={`rounded-full bg-[#7E96A0] text-white flex items-center justify-center font-bold shrink-0 select-none ${sizeClasses[size]} ${className}`}
    >
      {initial}
    </div>
  );
}
