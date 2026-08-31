import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket,
  Popcorn,
  Calendar,
  Film,
  Building2,
  Sparkles,
} from 'lucide-react';

interface Props {
  onOpenPosBooking: () => void;
  onOpenPosSnack: () => void;
}

export const QuickActionsBar: React.FC<Props> = ({
  onOpenPosBooking,
  onOpenPosSnack,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          Cashier & Manager Quick Actions
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Ticket POS */}
        <button
          type="button"
          onClick={onOpenPosBooking}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer active:scale-95"
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>New Ticket POS</span>
        </button>

        {/* Snack POS */}
        <button
          type="button"
          onClick={onOpenPosSnack}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
        >
          <Popcorn className="w-3.5 h-3.5" />
          <span>New Snack POS</span>
        </button>

        {/* Schedule */}
        <button
          type="button"
          onClick={() => navigate('/dashboard/showtimes')}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/60 transition-colors cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Showtimes</span>
        </button>

        {/* Catalog */}
        <button
          type="button"
          onClick={() => navigate('/dashboard/movies')}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/60 transition-colors cursor-pointer"
        >
          <Film className="w-3.5 h-3.5 text-slate-400" />
          <span>Movies</span>
        </button>

        {/* Cinemas */}
        <button
          type="button"
          onClick={() => navigate('/dashboard/cinemas')}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/60 transition-colors cursor-pointer"
        >
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Cinemas</span>
        </button>
      </div>
    </div>
  );
};
