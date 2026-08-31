import React from 'react';
import { Popcorn, Plus } from 'lucide-react';
import { SnackCard } from './SnackCard';
import type { Snack } from '../../../types';

interface Props {
  snacks: Snack[];
  isLoading: boolean;
  onEdit: (snack: Snack) => void;
  onDelete: (snack: Snack) => void;
  onToggleAvailability: (id: string, is_available: boolean) => void;
  onAddSnack: () => void;
}

export const SnackList: React.FC<Props> = ({
  snacks,
  isLoading,
  onEdit,
  onDelete,
  onToggleAvailability,
  onAddSnack,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 h-64 animate-pulse flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-28 bg-slate-800/60 rounded-xl" />
              <div className="h-4 bg-slate-800/80 rounded-md w-3/4" />
              <div className="h-3 bg-slate-800/40 rounded-md w-1/2" />
            </div>
            <div className="h-8 bg-slate-800/50 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (snacks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
          <Popcorn className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-bold text-white">No Concession Items Found</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
          No snacks or beverages match your current filter. Add a new item to your menu catalog.
        </p>
        <button
          type="button"
          onClick={onAddSnack}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-red-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Item</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {snacks.map((snack) => (
        <SnackCard
          key={snack.id}
          snack={snack}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleAvailability={onToggleAvailability}
        />
      ))}
    </div>
  );
};
