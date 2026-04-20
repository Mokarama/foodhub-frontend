'use client';

import React, { useEffect } from 'react';
import { IoCheckmarkCircle, IoAlert, IoClose } from 'react-icons/io5';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgClasses = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const textClasses = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
  };

  const iconClasses = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
  };

  const IconComponent = type === 'error' ? IoAlert : IoCheckmarkCircle;

  return (
    <div
      className={`
        fixed top-4 right-4 flex items-center gap-3 p-4 rounded-lg border
        ${bgClasses[type]} ${textClasses[type]} shadow-lg
        animation-slideIn z-50
      `}
    >
      <IconComponent className={`flex-shrink-0 text-xl ${iconClasses[type]}`} />
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        <IoClose size={20} />
      </button>
    </div>
  );
}
