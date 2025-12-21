'use client';

import { useApp } from '@/context/AppContext';
import { MapPin, FileText, Calendar, Hash } from 'lucide-react';

export function MetricsSummary() {
  const { metrics } = useApp();

  return (
    <div className="bg-white border-b border-border">
      <div className="max-w-container mx-auto px-lg py-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Località - ultra compact */}
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-text-secondary">Loc:</span>
            <span className="text-base font-semibold text-text-primary">{metrics.totalLocalita}</span>
          </div>

          {/* Lemmi */}
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs text-text-secondary">Lemmi:</span>
            <span className="text-base font-semibold text-text-primary">{metrics.totalLemmi}</span>
          </div>

          {/* Anni */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary-hover" />
            <span className="text-xs text-text-secondary">Anni:</span>
            <span className="text-base font-semibold text-text-primary">{metrics.totalAnni}</span>
          </div>

          {/* Attestazioni */}
          <div className="flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-accent-hover" />
            <span className="text-xs text-text-secondary">Att:</span>
            <span className="text-base font-semibold text-text-primary">{metrics.totalAttestazioni}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
