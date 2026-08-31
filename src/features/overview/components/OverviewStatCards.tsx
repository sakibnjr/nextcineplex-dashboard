import React from 'react';
import {
  TrendingUp,
  Ticket,
  Popcorn,
  Building2,
  Armchair,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  totalGrossRevenue: number;
  ticketRevenue: number;
  snackRevenue: number;
  totalSeatsSold: number;
  totalBookings: number;
  totalSnackOrders: number;
  totalBranches: number;
  totalCapacity: number;
  isLoading: boolean;
}

export const OverviewStatCards: React.FC<Props> = ({
  totalGrossRevenue,
  ticketRevenue,
  snackRevenue,
  totalSeatsSold,
  totalBookings,
  totalSnackOrders,
  totalBranches,
  totalCapacity,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 h-32 animate-pulse flex flex-col justify-between"
          >
            <div className="h-4 bg-slate-800/80 rounded w-1/2" />
            <div className="h-7 bg-slate-800/60 rounded w-3/4" />
            <div className="h-3 bg-slate-800/40 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Gross Revenue */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800/90 hover:border-emerald-500/40 rounded-2xl p-5 shadow-lg transition-all duration-200 group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Gross Revenue
          </span>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
            ৳
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-2xl font-black text-emerald-400 tracking-tight">
            ৳{totalGrossRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>Combined Box Office & Concessions</span>
          </p>
        </div>
      </div>

      {/* Box Office Tickets */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800/90 hover:border-red-500/40 rounded-2xl p-5 shadow-lg transition-all duration-200 group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Box Office Sales
          </span>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
            <Ticket className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-2xl font-black text-white tracking-tight">
            ৳{ticketRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <Armchair className="w-3 h-3 text-red-400" />
            <span>
              {totalSeatsSold} tickets reserved ({totalBookings} orders)
            </span>
          </p>
        </div>
      </div>

      {/* Concession Bar */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800/90 hover:border-amber-500/40 rounded-2xl p-5 shadow-lg transition-all duration-200 group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Snacks & Concessions
          </span>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Popcorn className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-2xl font-black text-amber-400 tracking-tight">
            ৳{snackRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-amber-400" />
            <span>{totalSnackOrders} food & beverage orders</span>
          </p>
        </div>
      </div>

      {/* Multiplex Footprint */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800/90 hover:border-blue-500/40 rounded-2xl p-5 shadow-lg transition-all duration-200 group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Multiplex Network
          </span>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-2xl font-black text-white tracking-tight">
            {totalBranches} Branches
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <Armchair className="w-3 h-3 text-blue-400" />
            <span>{totalCapacity.toLocaleString()} total seating capacity</span>
          </p>
        </div>
      </div>
    </div>
  );
};
