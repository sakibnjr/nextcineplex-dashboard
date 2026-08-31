import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import type { Showtime } from '../../../types';

interface Props {
  isOpen: boolean;
  showtime: Showtime | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
  isLoading: boolean;
}

export const DeleteShowtimeDialog: React.FC<Props> = ({
  isOpen,
  showtime,
  onClose,
  onConfirm,
  isLoading,
}) => {
  if (!isOpen || !showtime) return null;

  const startDate = new Date(showtime.start_time).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-white">Delete Showtime?</h3>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Are you sure you want to remove the screening of{' '}
          <span className="text-white font-semibold">{showtime.movie?.title}</span> at{' '}
          <span className="text-white font-semibold">{showtime.cinema?.name}</span> scheduled for {startDate}?
        </p>

        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[11px] text-red-400 leading-relaxed">
          <strong>Note:</strong> If customer ticket bookings already exist for this showtime, deleting it directly will fail or invalidate their tickets. You may prefer setting its status to <em>Cancelled</em> instead.
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onConfirm(showtime.id)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl shadow-lg shadow-red-600/20 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isLoading ? 'Deleting...' : 'Delete Showtime'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
