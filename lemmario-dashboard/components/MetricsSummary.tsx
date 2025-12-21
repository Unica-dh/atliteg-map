'use client';

import { useApp } from '@/context/AppContext';
import { MapPin, FileText, Calendar, Hash } from 'lucide-react';

export function MetricsSummary() {
  const { metrics } = useApp();

  return (
    <div className="bg-white border-b border-border">
      <div className="max-w-container mx-auto px-lg py-3">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          {/* Località */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm text-text-secondary">Località:</span>
            <span className="text-lg font-semibold text-text-primary">{metrics.totalLocalita}</span>
          </div>

          {/* Lemmi */}
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            <span className="text-sm text-text-secondary">Lemmi:</span>
            <span className="text-lg font-semibold text-text-primary">{metrics.totalLemmi}</span>
          </div>

          {/* Anni */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-hover" />
            <span className="text-sm text-text-secondary">Anni:</span>
            <span className="text-lg font-semibold text-text-primary">{metrics.totalAnni}</span>
          </div>

          {/* Attestazioni */}
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-accent-hover" />
            <span className="text-sm text-text-secondary">Attestazioni:</span>
            <span className="text-lg font-semibold text-text-primary">{metrics.totalAttestazioni}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
