import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="w-full p-3 bg-white text-black rounded-lg hover:bg-gray-200 transition font-semibold"
    >
      {children}
    </button>
  );
}