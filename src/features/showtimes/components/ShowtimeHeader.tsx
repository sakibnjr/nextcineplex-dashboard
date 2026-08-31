import React from 'react';
import { Plus, Search, Calendar, Film, Building2 } from 'lucide-react';
import type { Cinema, Movie } from '../../../types';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  cinemaFilter: string;
  onCinemaFilterChange: (id: string) => void;
  movieFilter: string;
  onMovieFilterChange: (id: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  cinemas: Cinema[];
  movies: Movie[];
  totalCount: number;
  onOpenScheduleModal: () => void;
}

export const ShowtimeHeader: React.FC<Props> = ({
  search,
  onSearchChange,
  cinemaFilter,
  onCinemaFilterChange,
  movieFilter,
  onMovieFilterChange,
  statusFilter,
  onStatusFilterChange,
  cinemas,
  movies,
  totalCount,
  onOpenScheduleModal,
}) => {
  return (
    <div className="flex flex-col gap-4 pb-6 border-b border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Showtimes & Schedules
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-slate-800 text-slate-300 rounded-full border border-slate-700/50">
                {totalCount} Screenings
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Coordinate movie screenings, auditoriums, and ticket pricing across branches.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenScheduleModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-600/20 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Screening</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search movie title or theater..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-slate-200 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Cinema Filter */}
        <div className="relative">
          <select
            value={cinemaFilter}
            onChange={(e) => onCinemaFilterChange(e.target.value)}
            aria-label="Filter by Cinema"
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl pl-8 pr-8 py-2 outline-none focus:border-red-500 transition-all cursor-pointer appearance-none"
          >
            <option value="all">All Cinemas</option>
            {cinemas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.city})
              </option>
            ))}
          </select>
          <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Movie Filter */}
        <div className="relative">
          <select
            value={movieFilter}
            onChange={(e) => onMovieFilterChange(e.target.value)}
            aria-label="Filter by Movie"
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl pl-8 pr-8 py-2 outline-none focus:border-red-500 transition-all cursor-pointer appearance-none"
          >
            <option value="all">All Movies</option>
            {movies.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
          <Film className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          aria-label="Filter by Status"
          className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-red-500 transition-all cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
};
