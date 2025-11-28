import { MapPin, FileText, Calendar, TrendingUp } from 'lucide-react';
import type { DashboardMetrics } from '../types';

interface MetricsSummaryProps {
  metrics: DashboardMetrics;
  className?: string;
}

export function MetricsSummary({ metrics, className = '' }: MetricsSummaryProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      <MetricCard
        icon={<MapPin className="h-5 w-5" />}
        label="Località"
        value={metrics.totalLocations}
        color="blue"
      />
      <MetricCard
        icon={<FileText className="h-5 w-5" />}
        label="Lemmi"
        value={metrics.totalLemmas}
        color="green"
      />
      <MetricCard
        icon={<Calendar className="h-5 w-5" />}
        label="Anni con attestazioni"
        value={`${metrics.yearsWithData} / ${metrics.totalYears}`}
        color="purple"
      />
      <MetricCard
        icon={<TrendingUp className="h-5 w-5" />}
        label="Attestazioni totali"
        value={metrics.totalAttestations}
        color="orange"
      />
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function MetricCard({ icon, label, value, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`} aria-hidden="true">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 truncate">{label}</p>
          <p className="text-2xl font-semibold text-gray-900" aria-label={`${label}: ${value}`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
