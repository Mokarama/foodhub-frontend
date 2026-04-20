import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export default function Card({
  children,
  className = '',
  onClick,
  hoverable = false,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg shadow-md p-6
        transition-all duration-200
        ${hoverable ? 'hover:shadow-lg hover:scale-105 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
