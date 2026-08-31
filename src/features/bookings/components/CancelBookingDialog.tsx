import React from 'react';
import { AlertTriangle, Ban } from 'lucide-react';
import type { Booking } from '../../../types';

interface Props {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
  isLoading: boolean;
}

export const CancelBookingDialog: React.FC<Props> = ({
  isOpen,
  booking,
  onClose,
  onConfirm,
  isLoading,
}) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-white">Cancel Reservation?</h3>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Are you sure you want to cancel booking{' '}
          <span className="text-white font-mono font-bold">{booking.booking_code}</span> for{' '}
          <span className="text-white font-semibold">{booking.showtime?.movie?.title}</span>?
        </p>

        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[11px] text-red-400 leading-relaxed">
          <strong>Notice:</strong> Cancelling this reservation will immediately release{' '}
          {booking.booking_seats?.length || 1} reserved seat(s) back to the available inventory for other guests.
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Keep Booking
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onConfirm(booking.id)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl shadow-lg shadow-red-600/20 transition-colors cursor-pointer"
          >
            <Ban className="w-4 h-4" />
            <span>{isLoading ? 'Cancelling...' : 'Cancel Reservation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
