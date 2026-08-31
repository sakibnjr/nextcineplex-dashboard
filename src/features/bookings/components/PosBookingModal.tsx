import React, { useState, useMemo } from 'react';
import {
  X,
  Armchair,
  CheckCircle2,
  AlertCircle,
  Film,
  User,
  ShoppingBag,
  Loader2,
  Lock,
  Crown,
  Accessibility,
} from 'lucide-react';
import { useCinemaSeats } from '../../cinemas/hooks/useCinemaSeats';
import { useShowtimeBookedSeats } from '../hooks/useShowtimeBookedSeats';
import type {
  Showtime,
  Profile,
  Seat,
  CreateBookingPayload,
} from '../../../types';

interface Props {
  isOpen: boolean;
  showtimes: Showtime[];
  profiles: Profile[];
  onClose: () => void;
  onSubmit: (payload: CreateBookingPayload) => Promise<void>;
  isLoading: boolean;
}

export const PosBookingModal: React.FC<Props> = ({
  isOpen,
  showtimes,
  profiles,
  onClose,
  onSubmit,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <PosBookingModalContent
      showtimes={showtimes}
      profiles={profiles}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  );
};

interface ContentProps {
  showtimes: Showtime[];
  profiles: Profile[];
  onClose: () => void;
  onSubmit: (payload: CreateBookingPayload) => Promise<void>;
  isLoading: boolean;
}

const PosBookingModalContent: React.FC<ContentProps> = ({
  showtimes,
  profiles,
  onClose,
  onSubmit,
  isLoading,
}) => {
  // Only allow scheduled future/active showtimes
  const activeShowtimes = useMemo(() => {
    return showtimes.filter((s) => s.status === 'scheduled');
  }, [showtimes]);

  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string>(
    activeShowtimes[0]?.id || ''
  );
  const [selectedUserId, setSelectedUserId] = useState<string>(
    profiles[0]?.id || ''
  );
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedShowtime = useMemo(() => {
    return activeShowtimes.find((s) => s.id === selectedShowtimeId);
  }, [activeShowtimes, selectedShowtimeId]);

  // Fetch auditorium seats
  const { data: cinemaSeats = [], isLoading: isLoadingSeats } = useCinemaSeats(
    selectedShowtime?.cinema_id
  );

  // Fetch already booked seats for this showtime
  const { data: bookedSeatIds = [], isLoading: isLoadingBooked } =
    useShowtimeBookedSeats(selectedShowtimeId);

  // Calculate pricing
  const basePrice = selectedShowtime?.ticket_price || 12.0;

  const selectedSeatsWithPrice = useMemo(() => {
    return selectedSeatIds
      .map((seatId) => {
        const seat = cinemaSeats.find((s) => s.id === seatId);
        if (!seat) return null;
        let price = basePrice;
        if (seat.seat_type === 'premium') {
          price = Math.round(basePrice * 1.35 * 100) / 100; // 35% VIP markup
        }
        return { seat, price };
      })
      .filter((item): item is { seat: Seat; price: number } => item !== null);
  }, [selectedSeatIds, cinemaSeats, basePrice]);

  const totalPrice = useMemo(() => {
    return selectedSeatsWithPrice.reduce((sum, item) => sum + item.price, 0);
  }, [selectedSeatsWithPrice]);

  // Group cinema seats by row
  const rowMap = useMemo(() => {
    const map = new Map<string, Seat[]>();
    const sorted = [...cinemaSeats].sort((a, b) => {
      if (a.row_label !== b.row_label) {
        return a.row_label.localeCompare(b.row_label);
      }
      const numA = parseInt(a.seat_number.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.seat_number.replace(/\D/g, ''), 10) || 0;
      return numA - numB;
    });

    sorted.forEach((seat) => {
      const existing = map.get(seat.row_label) || [];
      existing.push(seat);
      map.set(seat.row_label, existing);
    });
    return map;
  }, [cinemaSeats]);

  const sortedRows = Array.from(rowMap.keys()).sort();

  const handleToggleSeat = (seatId: string) => {
    if (bookedSeatIds.includes(seatId)) return; // Cannot select booked seats

    setSelectedSeatIds((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleShowtimeChange = (id: string) => {
    setSelectedShowtimeId(id);
    setSelectedSeatIds([]); // Clear selection on screening change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShowtimeId) {
      setErrorMsg('Please select a showtime screening.');
      return;
    }
    if (selectedSeatIds.length === 0) {
      setErrorMsg('Please select at least one seat from the auditorium map.');
      return;
    }

    setErrorMsg(null);
    try {
      const payload: CreateBookingPayload = {
        user_id: selectedUserId || profiles[0]?.id || '',
        showtime_id: selectedShowtimeId,
        seats: selectedSeatsWithPrice.map((item) => ({
          seat_id: item.seat.id,
          unit_price: item.price,
        })),
        total_amount: totalPrice,
      };

      await onSubmit(payload);
      onClose();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Failed to complete POS booking');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                POS Box Office Ticket Booking
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Select a screening, pick customer seats on the live map, and issue tickets.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-y-auto">
          {/* Left 2 Cols: Screening Selection & Live Seat Map */}
          <div className="lg:col-span-2 p-5 border-b lg:border-b-0 lg:border-r border-slate-800/80 space-y-5 overflow-y-auto">
            {/* Screening Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Select Movie Screening <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedShowtimeId}
                  onChange={(e) => handleShowtimeChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none transition-colors appearance-none cursor-pointer"
                >
                  {activeShowtimes.map((st) => {
                    const d = new Date(st.start_time);
                    const formatted = `${d.toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })} @ ${d.toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}`;
                    return (
                      <option key={st.id} value={st.id}>
                        {st.movie?.title} — {st.cinema?.name} ({formatted}) - ৳{Number(st.ticket_price).toFixed(2)}
                      </option>
                    );
                  })}
                </select>
                <Film className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Screen Graphic & Seat Legend */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <div className="w-3 h-3 rounded-sm bg-slate-800 border border-slate-700" />
                  <span>Available (৳{basePrice.toFixed(2)})</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <div className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-500/50" />
                  <span>VIP (৳{(basePrice * 1.35).toFixed(2)})</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <div className="w-3 h-3 rounded-sm bg-emerald-500 border border-emerald-400" />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-400">
                  <div className="w-3 h-3 rounded-sm bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                    <Lock className="w-2 h-2 text-rose-400" />
                  </div>
                  <span>Occupied</span>
                </div>
              </div>

              {/* Curved screen */}
              <div className="relative py-2 flex flex-col items-center">
                <div className="w-3/4 max-w-md h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
                <span className="text-[9px] font-bold tracking-[0.2em] text-slate-500 uppercase mt-1">
                  SCREEN
                </span>
              </div>

              {/* Interactive Seat Map Matrix */}
              {isLoadingSeats || isLoadingBooked ? (
                <div className="py-16 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                  <span className="text-xs text-slate-400">Loading seat layout...</span>
                </div>
              ) : sortedRows.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  No seats configured for this theater auditorium.
                </div>
              ) : (
                <div className="overflow-x-auto pb-4 max-h-72 custom-scrollbar">
                  <div className="min-w-max flex flex-col items-center gap-2">
                    {sortedRows.map((rowLabel) => {
                      const rowSeats = rowMap.get(rowLabel) || [];
                      return (
                        <div key={rowLabel} className="flex items-center gap-2">
                          <span className="w-6 text-center text-[11px] font-bold text-slate-500">
                            {rowLabel}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {rowSeats.map((seat) => {
                              const isBooked = bookedSeatIds.includes(seat.id);
                              const isSelected = selectedSeatIds.includes(seat.id);
                              const isVip = seat.seat_type === 'premium';
                              const isAccessible = seat.seat_type === 'accessible';

                              let styleClass =
                                'bg-slate-900 border-slate-700/80 text-slate-300 hover:border-slate-500';

                              if (isBooked) {
                                styleClass =
                                  'bg-rose-500/10 border-rose-500/30 text-rose-500/50 cursor-not-allowed';
                              } else if (isSelected) {
                                styleClass =
                                  'bg-emerald-500 border-emerald-400 text-slate-950 font-bold scale-105 shadow-md shadow-emerald-500/20';
                              } else if (isVip) {
                                styleClass =
                                  'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25';
                              } else if (isAccessible) {
                                styleClass =
                                  'bg-blue-500/15 border-blue-500/40 text-blue-300 hover:bg-blue-500/25';
                              }

                              return (
                                <button
                                  key={seat.id}
                                  type="button"
                                  disabled={isBooked}
                                  onClick={() => handleToggleSeat(seat.id)}
                                  title={`Seat ${seat.seat_number} ${isBooked ? '(Occupied)' : `(${seat.seat_type})`}`}
                                  className={`w-7 h-7 rounded-lg border text-[10px] flex items-center justify-center transition-all cursor-pointer ${styleClass}`}
                                >
                                  {isBooked ? (
                                    <Lock className="w-2.5 h-2.5" />
                                  ) : isVip ? (
                                    <Crown className="w-2.5 h-2.5 text-amber-400" />
                                  ) : isAccessible ? (
                                    <Accessibility className="w-2.5 h-2.5 text-blue-400" />
                                  ) : (
                                    <span>{seat.seat_number.replace(seat.row_label, '')}</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Customer & Checkout Cart Summary */}
          <div className="p-5 flex flex-col justify-between space-y-4 bg-slate-950/60">
            <div className="space-y-4">
              {/* Customer Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Customer / Guest <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none transition-colors appearance-none cursor-pointer"
                  >
                    {profiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.full_name || 'Customer'} ({p.phone || 'No Phone'})
                      </option>
                    ))}
                  </select>
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Selected Seats Itemized List */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Selected Seats ({selectedSeatsWithPrice.length})
                </label>

                {selectedSeatsWithPrice.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                    Click seats on the auditorium map to add them to this order.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                    {selectedSeatsWithPrice.map(({ seat, price }) => (
                      <div
                        key={seat.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Armchair className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-bold text-white font-mono">
                            {seat.seat_number}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">
                            ({seat.seat_type})
                          </span>
                        </div>
                        <span className="font-semibold text-emerald-400">
                          ৳{price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Total & Checkout */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Tickets Count:</span>
                <span className="text-white font-semibold">{selectedSeatIds.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-300">Total Charge:</span>
                <span className="text-xl font-black text-emerald-400">
                  ৳{totalPrice.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                disabled={isLoading || selectedSeatIds.length === 0}
                onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-600/25 transition-all cursor-pointer active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Issue Tickets (৳{totalPrice.toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
