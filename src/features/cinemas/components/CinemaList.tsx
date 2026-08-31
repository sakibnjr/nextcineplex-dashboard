import React from 'react';
import { Building2, Plus } from 'lucide-react';
import { CinemaCard } from './CinemaCard';
import type { CinemaWithStats } from '../../../types';

interface Props {
  cinemas: CinemaWithStats[];
  isLoading: boolean;
  onEdit: (cinema: CinemaWithStats) => void;
  onDelete: (cinema: CinemaWithStats) => void;
  onManageSeats: (cinema: CinemaWithStats) => void;
  onAddCinema: () => void;
}

export const CinemaList: React.FC<Props> = ({
  cinemas,
  isLoading,
  onEdit,
  onDelete,
  onManageSeats,
  onAddCinema,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 h-72 animate-pulse flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-36 bg-slate-800/60 rounded-xl" />
              <div className="h-4 bg-slate-800/80 rounded-md w-3/4" />
              <div className="h-3 bg-slate-800/40 rounded-md w-1/2" />
            </div>
            <div className="h-9 bg-slate-800/50 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (cinemas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-bold text-white">No Cinemas Found</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
          There are no cinema branches matching your filter criteria. Create a new branch to begin scheduling showtimes.
        </p>
        <button
          type="button"
          onClick={onAddCinema}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-red-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add First Cinema</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {cinemas.map((cinema) => (
        <CinemaCard
          key={cinema.id}
          cinema={cinema}
          onEdit={onEdit}
          onDelete={onDelete}
          onManageSeats={onManageSeats}
        />
      ))}
    </div>
  );
};
