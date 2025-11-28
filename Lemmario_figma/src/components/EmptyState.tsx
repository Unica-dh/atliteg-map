import { AlertCircle, FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'alert' | 'question';
  title: string;
  message?: string;
  className?: string;
}

export function EmptyState({ 
  icon = 'question', 
  title, 
  message,
  className = ''
}: EmptyStateProps) {
  const Icon = icon === 'alert' ? AlertCircle : FileQuestion;

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <Icon className="h-16 w-16 text-gray-400 mb-4" aria-hidden="true" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {message && <p className="text-sm text-gray-600 max-w-md">{message}</p>}
    </div>
  );
}
