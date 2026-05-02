import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ ...props }: InputProps) {
  return (
    <input
      {...props}
      className="w-full p-3 bg-transparent border border-white/10 
      rounded-lg focus:outline-none focus:border-purple-400 
      focus:shadow-[0_0_10px_rgba(168,85,247,0.5)] 
      transition-all duration-300"
    />
  );
}