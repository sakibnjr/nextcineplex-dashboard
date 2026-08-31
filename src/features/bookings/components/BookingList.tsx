import React from 'react';
import {
  Ticket,
  User,
  MapPin,
  Calendar,
  Eye,
  Ban,
  Plus,
  Armchair,
} from 'lucide-react';
import { BookingStatusBadge } from './BookingStatusBadge';
import type { Booking } from '../../../types';

interface Props {
  bookings: Booking[];
  isLoading: boolean;
  onViewTicket: (booking: Booking) => void;
  onCancelBooking: (booking: Booking) => void;
  onNewBooking: () => void;
}

export const BookingList: React.FC<Props> = ({
  bookings,
  isLoading,
  onViewTicket,
  onCancelBooking,
  onNewBooking,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 h-24 animate-pulse flex items-center justify-between"
          >
            <div className="flex items-center gap-3 w-1/3">
              <div className="w-12 h-12 bg-slate-800/60 rounded-xl" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-800/80 rounded w-3/4" />
                <div className="h-3 bg-slate-800/40 rounded w-1/2" />
              </div>
            </div>
            <div className="h-6 bg-slate-800/50 rounded-lg w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-4">
          <Ticket className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-bold text-white">No Bookings Found</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
          No customer ticket orders match your filter criteria. Issue a new walk-in ticket at the box office.
        </p>
        <button
          type="button"
          onClick={onNewBooking}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-red-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New POS Booking</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => {
        const startDate = booking.showtime
          ? new Date(booking.showtime.start_time)
          : null;

        const formattedDate = startDate
          ? startDate.toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })
          : '';

        const formattedTime = startDate
          ? startDate.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '';

        const seatsCount = booking.booking_seats?.length || 1;

        return (
          <div
            key={booking.id}
            className="bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-4 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg hover:shadow-xl hover:shadow-black/40"
          >
            {/* Booking Code & Customer */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <Ticket className="w-6 h-6" />
              </div>

              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-white tracking-wider">
                    {booking.booking_code}
                  </span>
                  <BookingStatusBadge status={booking.status} />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-300">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    {booking.profile?.full_name || 'Walk-in Customer'}
                  </span>
                  {booking.profile?.phone && (
                    <span className="text-[11px] text-slate-500">• {booking.profile.phone}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Screening Details */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs border-y sm:border-y-0 border-slate-800/60 py-2 sm:py-0">
              <div className="space-y-0.5 min-w-[140px]">
                <span className="font-bold text-white truncate block">
                  {booking.showtime?.movie?.title || 'Screening'}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-400" />
                  {booking.showtime?.cinema?.name}
                </span>
              </div>

              <div className="space-y-0.5 min-w-[120px]">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {formattedDate} @ {formattedTime}
                </span>
                <span className="text-[11px] text-slate-300 font-semibold">
                  {seatsCount} {seatsCount === 1 ? 'Ticket' : 'Tickets'}
                </span>
              </div>

              {/* Reserved Seat Tags */}
              <div className="flex flex-wrap gap-1 max-w-xs">
                {booking.booking_seats?.slice(0, 4).map((bs) => (
                  <span
                    key={bs.id}
                    className="px-1.5 py-0.5 bg-slate-950 border border-slate-700/60 rounded text-[10px] font-mono font-bold text-amber-300 flex items-center gap-0.5"
                  >
                    <Armchair className="w-2.5 h-2.5" />
                    {bs.seat?.seat_number || 'Seat'}
                  </span>
                ))}
                {seatsCount > 4 && (
                  <span className="px-1 py-0.5 text-[10px] text-slate-500">
                    +{seatsCount - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Price & Actions */}
            <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  Total Paid
                </span>
                <span className="text-base font-black text-emerald-400">
                  ৳{Number(booking.total_amount).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onViewTicket(booking)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/60 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>E-Ticket</span>
                </button>

                {booking.status === 'confirmed' && (
                  <button
                    type="button"
                    onClick={() => onCancelBooking(booking)}
                    title="Cancel reservation"
                    aria-label="Cancel reservation"
                    className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors cursor-pointer"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
