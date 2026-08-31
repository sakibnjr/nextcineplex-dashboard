import React from 'react';
import {
  Clock,
  MapPin,
  Tag,
  Edit2,
  Trash2,
  Film,
  Calendar,
} from 'lucide-react';
import { ShowtimeStatusBadge } from './ShowtimeStatusBadge';
import type { Showtime, ShowtimeStatus } from '../../../types';

interface Props {
  showtime: Showtime;
  onEdit: (showtime: Showtime) => void;
  onDelete: (showtime: Showtime) => void;
  onStatusChange: (id: string, status: ShowtimeStatus) => void;
}

export const ShowtimeCard: React.FC<Props> = ({
  showtime,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const startDate = new Date(showtime.start_time);
  const endDate = new Date(showtime.end_time);

  const formattedDate = startDate.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const formattedStartTime = startDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedEndTime = endDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-4 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg hover:shadow-xl hover:shadow-black/40">
      {/* Left side: Poster & Movie info */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="w-14 h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 relative">
          {showtime.movie?.poster_url ? (
            <img
              src={showtime.movie.poster_url}
              alt={showtime.movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-700">
              <Film className="w-6 h-6" />
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
              {showtime.movie?.title || 'Unknown Movie'}
            </h3>
            <ShowtimeStatusBadge status={showtime.status} />
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
              {showtime.cinema?.name} ({showtime.cinema?.city})
            </span>

            {showtime.movie?.duration_minutes && (
              <span className="text-[11px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded-md">
                {showtime.movie.duration_minutes} mins
              </span>
            )}

            {showtime.movie?.genre && (
              <span className="text-[11px] text-slate-500">
                • {showtime.movie.genre}
              </span>
            )}
          </div>

          {/* Time & Price banner */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <span className="flex items-center gap-1 text-slate-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {formattedDate}
            </span>

            <span className="flex items-center gap-1 text-red-400 font-semibold bg-red-500/10 px-2 py-0.5 rounded-lg border border-red-500/20">
              <Clock className="w-3.5 h-3.5" />
              {formattedStartTime} – {formattedEndTime}
            </span>

            <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
              <Tag className="w-3.5 h-3.5" />
              ৳{Number(showtime.ticket_price).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Quick Actions & Status Select */}
      <div className="flex items-center gap-2 self-end sm:self-center border-t sm:border-t-0 border-slate-800/80 pt-3 sm:pt-0 w-full sm:w-auto justify-end">
        {/* Quick Status Dropdown */}
        <select
          value={showtime.status}
          onChange={(e) => onStatusChange(showtime.id, e.target.value as ShowtimeStatus)}
          aria-label="Change showtime status"
          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-2.5 py-1.5 outline-none focus:border-red-500 transition-colors cursor-pointer"
        >
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Edit */}
        <button
          type="button"
          onClick={() => onEdit(showtime)}
          aria-label="Edit showtime"
          className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/40 rounded-xl transition-colors cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(showtime)}
          aria-label="Delete showtime"
          className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
