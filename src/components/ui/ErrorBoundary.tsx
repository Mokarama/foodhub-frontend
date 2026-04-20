'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { IoAlert } from 'react-icons/io5';
import Button from './Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [state, setState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
  });

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setState({
        hasError: true,
        error: event.error,
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (state.hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 rounded-full p-3">
              <IoAlert className="text-red-600 text-3xl" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600 text-center mb-4">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          {process.env.NODE_ENV === 'development' && state.error && (
            <div className="bg-gray-100 rounded p-3 mb-4 text-xs text-gray-700 font-mono overflow-auto max-h-40">
              {state.error.message}
            </div>
          )}
          <Button
            fullWidth
            onClick={() => {
              setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
