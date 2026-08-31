import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Armchair, ChevronRight } from 'lucide-react';
import type { CinemaWithStats } from '../../../types';

interface Props {
  cinemas: CinemaWithStats[];
  isLoading: boolean;
}

export const BranchDistributionWidget: React.FC<Props> = ({
  cinemas,
  isLoading,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
        <div className="h-4 bg-slate-800 rounded w-1/3 animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Multiplex Branches & Capacity
            </h3>
          </div>

          <button
            type="button"
            onClick={() => navigate('/dashboard/cinemas')}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-0.5 font-semibold cursor-pointer"
          >
            <span>All Branches</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {cinemas.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No cinema branches added yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {cinemas.slice(0, 4).map((cinema) => (
              <div
                key={cinema.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="min-w-0 space-y-0.5">
                  <span className="font-bold text-xs text-white truncate block">
                    {cinema.name}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-400" />
                    {cinema.city} — {cinema.address}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Armchair className="w-3 h-3" />
                    {cinema.seats_count} Seats
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
