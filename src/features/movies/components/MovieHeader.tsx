import React from 'react';
import { Plus, Search, Film } from 'lucide-react';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onOpenAddModal: () => void;
  totalCount: number;
}

export const MovieHeader: React.FC<Props> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onOpenAddModal,
  totalCount,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
      <div>
        <div className="flex items-center gap-2">
          <Film className="w-6 h-6 text-red-500" />
          <h1 className="text-2xl font-bold text-white tracking-tight">Movies Catalog</h1>
          <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-slate-800 text-slate-300 rounded-full">
            {totalCount}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Manage cinema screenings, release dates, durations, and poster backdrops.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, genre..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-slate-200 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          aria-label="Filter by Status"
          className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-red-500 transition-all cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="now_showing">Now Showing</option>
          <option value="upcoming">Upcoming</option>
          <option value="ended">Ended</option>
        </select>

        {/* Add Movie */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Movie</span>
        </button>
      </div>
    </div>
  );
};
