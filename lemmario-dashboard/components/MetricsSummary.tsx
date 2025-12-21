'use client';

import { useApp } from '@/context/AppContext';
import { MapPin, FileText, Calendar, Hash } from 'lucide-react';

export function MetricsSummary() {
  const { metrics } = useApp();

  return (
    <div className="bg-white/90 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-container mx-auto px-lg py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-border rounded-md p-lg hover:shadow-card-hover transition-normal cursor-default">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary rounded-md">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary">Località</p>
                <p className="text-3xl font-semibold text-text-primary mt-1">{metrics.totalLocalita}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-md p-lg hover:shadow-card-hover transition-normal cursor-default">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent rounded-md">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary">Lemmi</p>
                <p className="text-3xl font-semibold text-text-primary mt-1">{metrics.totalLemmi}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-md p-lg hover:shadow-card-hover transition-normal cursor-default">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-hover rounded-md">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary">Anni</p>
                <p className="text-3xl font-semibold text-text-primary mt-1">{metrics.totalAnni}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-md p-lg hover:shadow-card-hover transition-normal cursor-default">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-hover rounded-md">
                <Hash className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary">Attestazioni</p>
                <p className="text-3xl font-semibold text-text-primary mt-1">{metrics.totalAttestazioni}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
