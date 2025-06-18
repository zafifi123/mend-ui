import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </button>
  );
}
