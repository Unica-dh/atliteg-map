import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({ message = 'Caricamento...', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`} role="status" aria-live="polite">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" aria-hidden="true" />
      <p className="mt-4 text-gray-600 text-sm" aria-label={message}>{message}</p>
    </div>
  );
}
