import { MapPin, FileText, Calendar, TrendingUp } from 'lucide-react';
import type { DashboardMetrics } from '../types';

interface MetricsSummaryProps {
  metrics: DashboardMetrics;
  className?: string;
}

export function MetricsSummary({ metrics, className = '' }: MetricsSummaryProps) {
  return (
    <div className={`flex flex-wrap gap-3 lg:flex-col ${className}`}>
      <MetricCard
        icon={<MapPin className="h-4 w-4" />}
        label="Località"
        value={metrics.totalLocations}
        color="blue"
      />
      <MetricCard
        icon={<FileText className="h-4 w-4" />}
        label="Lemmi"
        value={metrics.totalLemmas}
        color="green"
      />
      <MetricCard
        icon={<Calendar className="h-4 w-4" />}
        label="Anni con attestazioni"
        value={`${metrics.yearsWithData} / ${metrics.totalYears}`}
        color="purple"
      />
      <MetricCard
        icon={<TrendingUp className="h-4 w-4" />}
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
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-2">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${colorClasses[color]} shrink-0`} aria-hidden="true">
            {icon}
          </div>
          <p className="text-xs text-gray-600 truncate">{label}</p>
        </div>
        <p className="text-lg font-semibold text-gray-900 text-center" aria-label={`${label}: ${value}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
