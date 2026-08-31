import React from 'react';
import { Edit2, Trash2, Popcorn, Check, X } from 'lucide-react';
import type { Snack } from '../../../types';

interface Props {
  snack: Snack;
  onEdit: (snack: Snack) => void;
  onDelete: (snack: Snack) => void;
  onToggleAvailability: (id: string, is_available: boolean) => void;
}

export const SnackCard: React.FC<Props> = ({
  snack,
  onEdit,
  onDelete,
  onToggleAvailability,
}) => {
  return (
    <div
      className={`group relative bg-slate-900/60 hover:bg-slate-900/90 border ${
        snack.is_available ? 'border-slate-800/80 hover:border-slate-700/80' : 'border-slate-800/40 opacity-75'
      } rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-xl hover:shadow-black/40`}
    >
      <div>
        {/* Cover / Image Area */}
        <div className="relative h-36 w-full overflow-hidden bg-slate-950">
          {snack.image_url ? (
            <img
              src={snack.image_url}
              alt={snack.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-700">
              <Popcorn className="w-10 h-10 stroke-[1.2]" />
              <span className="text-[10px] font-medium text-slate-600 mt-1">
                No Image
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-[11px] font-semibold bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/20 rounded-lg shadow-sm">
              {snack.category}
            </span>
          </div>

          {/* Stock Status Badge */}
          <div className="absolute top-3 right-3">
            {snack.is_available ? (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full flex items-center gap-1 backdrop-blur-sm">
                <Check className="w-2.5 h-2.5" /> In Stock
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full flex items-center gap-1 backdrop-blur-sm">
                <X className="w-2.5 h-2.5" /> Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors line-clamp-1">
              {snack.name}
            </h3>
            <span className="text-base font-black text-amber-400 shrink-0">
              ৳{Number(snack.price).toFixed(2)}
            </span>
          </div>

          {snack.description && (
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
              {snack.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-4 pt-2 flex items-center justify-between gap-2 border-t border-slate-800/60 mt-auto">
        {/* In-Stock Toggle Button */}
        <button
          type="button"
          onClick={() => onToggleAvailability(snack.id, !snack.is_available)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            snack.is_available
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/60'
              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
          }`}
        >
          {snack.is_available ? 'Mark Sold Out' : 'Mark Available'}
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(snack)}
            aria-label="Edit snack item"
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/40 rounded-xl transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(snack)}
            aria-label="Delete snack item"
            className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
