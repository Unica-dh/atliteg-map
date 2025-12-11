'use client';

import { useApp } from '@/context/AppContext';
import { MapPin, FileText, Calendar, Hash } from 'lucide-react';

export function MetricsSummary() {
  const { metrics } = useApp();

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card group hover:scale-105 cursor-default">
            <div className="flex items-center gap-4 p-5">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Località</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.totalLocalita}</p>
              </div>
            </div>
          </div>

          <div className="card group hover:scale-105 cursor-default">
            <div className="flex items-center gap-4 p-5">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Lemmi</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.totalLemmi}</p>
              </div>
            </div>
          </div>

          <div className="card group hover:scale-105 cursor-default">
            <div className="flex items-center gap-4 p-5">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Anni</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.totalAnni}</p>
              </div>
            </div>
          </div>

          <div className="card group hover:scale-105 cursor-default">
            <div className="flex items-center gap-4 p-5">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
                <Hash className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Attestazioni</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.totalAttestazioni}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
