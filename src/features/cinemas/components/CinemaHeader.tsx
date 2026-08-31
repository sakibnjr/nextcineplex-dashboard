import React from 'react';
import { Plus, Search, Building2, MapPin } from 'lucide-react';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  cityFilter: string;
  onCityFilterChange: (city: string) => void;
  cities: string[];
  totalBranches: number;
  totalSeats: number;
  onOpenAddModal: () => void;
}

export const CinemaHeader: React.FC<Props> = ({
  search,
  onSearchChange,
  cityFilter,
  onCityFilterChange,
  cities,
  totalBranches,
  totalSeats,
  onOpenAddModal,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Cinemas & Halls</h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-slate-800 text-slate-300 rounded-full border border-slate-700/50">
                {totalBranches} {totalBranches === 1 ? 'Branch' : 'Branches'}
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-medium bg-red-500/10 text-red-400 rounded-full border border-red-500/20">
                {totalSeats.toLocaleString()} Total Seats
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage cinema branches, theater auditoriums, and configure interactive seat maps.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by branch or location..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-slate-200 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* City Filter */}
        <div className="relative">
          <select
            value={cityFilter}
            onChange={(e) => onCityFilterChange(e.target.value)}
            aria-label="Filter by City"
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl pl-3 pr-8 py-2 outline-none focus:border-red-500 transition-all cursor-pointer appearance-none"
          >
            <option value="all">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <MapPin className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Add Cinema */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-600/20 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Cinema</span>
        </button>
      </div>
    </div>
  );
};
