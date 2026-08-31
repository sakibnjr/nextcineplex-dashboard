import React from 'react';
import {
  Ticket,
  Plus,
  Search,
  CheckCircle2,
  Armchair,
  Building2,
} from 'lucide-react';
import type { Cinema } from '../../../types';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  cinemaFilter: string;
  onCinemaFilterChange: (cinemaId: string) => void;
  cinemas: Cinema[];
  totalRevenue: number;
  totalBookings: number;
  totalSeatsSold: number;
  onOpenPosModal: () => void;
}

export const BookingHeader: React.FC<Props> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  cinemaFilter,
  onCinemaFilterChange,
  cinemas,
  totalRevenue,
  totalBookings,
  totalSeatsSold,
  onOpenPosModal,
}) => {
  return (
    <div className="flex flex-col gap-6 pb-6 border-b border-slate-800/80">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Bookings & POS Box Office
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-slate-800 text-slate-300 rounded-full border border-slate-700/50">
                {totalBookings} Orders
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage ticket reservations, POS box-office sales, customer checkouts, and seat allocations.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPosModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-600/25 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New POS Booking</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Box Office Revenue</p>
            <h3 className="text-xl font-black text-emerald-400 mt-1">
              ৳{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
            ৳
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Tickets Reserved</p>
            <h3 className="text-xl font-black text-white mt-1">
              {totalSeatsSold.toLocaleString()} Seats
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Armchair className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Confirmed Bookings</p>
            <h3 className="text-xl font-black text-slate-200 mt-1">
              {totalBookings.toLocaleString()} Orders
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-[220px] flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search booking code (NC-), customer, or movie..."
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

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          aria-label="Filter by Status"
          className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-red-500 transition-all cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
};
