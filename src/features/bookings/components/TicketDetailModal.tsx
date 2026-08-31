import React from 'react';
import {
  X,
  Printer,
  Calendar,
  Clock,
  MapPin,
  User,
  Armchair,
  CheckCircle2,
  Copy,
  Film,
} from 'lucide-react';
import { BookingStatusBadge } from './BookingStatusBadge';
import type { Booking } from '../../../types';

interface Props {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
}

export const TicketDetailModal: React.FC<Props> = ({
  isOpen,
  booking,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !booking) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.booking_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const startDate = booking.showtime
    ? new Date(booking.showtime.start_time)
    : null;

  const formattedDate = startDate
    ? startDate.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  const formattedTime = startDate
    ? startDate.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative print:border-none print:shadow-none print:w-full print:bg-white print:text-black">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 print:hidden">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-red-500" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              E-Ticket & Box Office Receipt
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ticket Body Card */}
        <div className="p-6 space-y-5">
          {/* Top Banner with Booking Code */}
          <div className="bg-gradient-to-r from-red-600/20 via-slate-900 to-slate-900 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Booking Reference
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black tracking-wider text-white font-mono">
                  {booking.booking_code}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                  title="Copy booking code"
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>

          {/* Movie Details */}
          <div className="flex gap-4 items-start">
            <div className="w-16 h-24 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0">
              {booking.showtime?.movie?.poster_url ? (
                <img
                  src={booking.showtime.movie.poster_url}
                  alt={booking.showtime.movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-700">
                  <Film className="w-6 h-6" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1.5">
              <h3 className="text-base font-bold text-white line-clamp-1">
                {booking.showtime?.movie?.title || 'Movie Screening'}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>
                  {booking.showtime?.cinema?.name} ({booking.showtime?.cinema?.city})
                </span>
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {formattedDate}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900 text-red-400 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-red-400" />
                  {formattedTime}
                </span>
              </div>
            </div>
          </div>

          {/* Customer & Seats Breakdown */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-500 font-medium block">Customer</span>
              <div className="flex items-center gap-1.5 mt-1 text-white font-semibold">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{booking.profile?.full_name || 'Walk-in Guest'}</span>
              </div>
              {booking.profile?.phone && (
                <span className="text-[11px] text-slate-400">{booking.profile.phone}</span>
              )}
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Reserved Seats</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {booking.booking_seats && booking.booking_seats.length > 0 ? (
                  booking.booking_seats.map((bs) => (
                    <span
                      key={bs.id}
                      className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-amber-300 font-mono font-bold rounded-lg text-xs flex items-center gap-1"
                    >
                      <Armchair className="w-3 h-3" />
                      {bs.seat?.seat_number || 'Seat'}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">Standard entry</span>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Total */}
          <div className="bg-slate-900/80 rounded-2xl p-4 flex items-center justify-between border border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 block">Total Amount Paid</span>
              <span className="text-xs text-slate-500">
                {booking.booking_seats?.length || 1} Tickets
              </span>
            </div>
            <span className="text-2xl font-black text-emerald-400">
              ৳{Number(booking.total_amount).toFixed(2)}
            </span>
          </div>

          {/* Barcode Graphic */}
          <div className="pt-2 text-center">
            <div className="h-10 bg-slate-900 rounded-lg p-2 flex items-center justify-center gap-1 overflow-hidden opacity-80 border border-slate-800">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className={`bg-white h-full ${i % 3 === 0 ? 'w-1' : i % 2 === 0 ? 'w-0.5' : 'w-1.5'}`}
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 block">
              Scan barcode at auditorium scanner
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 border-t border-slate-800/80 flex items-center justify-end gap-3 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-600/20 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print E-Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
