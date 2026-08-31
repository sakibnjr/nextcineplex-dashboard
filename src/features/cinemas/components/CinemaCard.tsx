import React from 'react';
import { MapPin, Armchair, Edit2, Trash2, Building } from 'lucide-react';
import type { CinemaWithStats } from '../../../types';

interface Props {
  cinema: CinemaWithStats;
  onEdit: (cinema: CinemaWithStats) => void;
  onDelete: (cinema: CinemaWithStats) => void;
  onManageSeats: (cinema: CinemaWithStats) => void;
}

export const CinemaCard: React.FC<Props> = ({
  cinema,
  onEdit,
  onDelete,
  onManageSeats,
}) => {
  return (
    <div className="group relative bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-xl hover:shadow-black/40">
      {/* Cover / Header Area */}
      <div>
        <div className="relative h-40 w-full overflow-hidden bg-slate-950">
          {cinema.image_url ? (
            <img
              src={cinema.image_url}
              alt={cinema.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-700">
              <Building className="w-12 h-12 stroke-[1.2]" />
              <span className="text-[11px] font-medium text-slate-600 mt-1">No Image Provided</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* City Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-[11px] font-semibold bg-slate-950/80 backdrop-blur-md text-red-400 border border-red-500/20 rounded-lg flex items-center gap-1 shadow-sm">
              <MapPin className="w-3 h-3" />
              {cinema.city}
            </span>
          </div>

          {/* Seat count badge */}
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 text-[11px] font-semibold bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-700/50 rounded-lg flex items-center gap-1.5 shadow-sm">
              <Armchair className="w-3.5 h-3.5 text-amber-400" />
              {cinema.seats_count} Seats
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2.5">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight group-hover:text-red-500 transition-colors line-clamp-1">
              {cinema.name}
            </h3>
            <p className="text-xs text-slate-500 flex items-start gap-1.5 mt-1 line-clamp-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{cinema.address}</span>
            </p>
          </div>

          {cinema.description && (
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed bg-slate-100/90 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/40">
              {cinema.description}
            </p>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-2 flex items-center gap-2 border-t border-slate-800/60 mt-auto">
        <button
          type="button"
          onClick={() => onManageSeats(cinema)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 hover:text-red-500 border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
        >
          <Armchair className="w-3.5 h-3.5" />
          <span>Seat Map ({cinema.seats_count})</span>
        </button>

        <button
          type="button"
          onClick={() => onEdit(cinema)}
          aria-label="Edit cinema"
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/40 rounded-xl transition-colors cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(cinema)}
          aria-label="Delete cinema"
          className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 rounded-xl transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
