import React from 'react';
import { FallbackProps } from 'react-error-boundary';

export const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-xl font-bold text-red-600 mb-2">Bir şeyler yanlış gitti</h2>
      <pre className="text-sm text-gray-600 mb-4">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Tekrar Dene
      </button>
    </div>
  );
};
