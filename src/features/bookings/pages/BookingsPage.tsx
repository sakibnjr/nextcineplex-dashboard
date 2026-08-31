import React, { useState, useMemo } from 'react';
import { useBookings } from '../hooks/useBookings';
import {
  useCreateBooking,
  useCancelBooking,
} from '../hooks/useBookingMutations';
import { useShowtimes } from '../../showtimes/hooks/useShowtimes';
import { useCinemas } from '../../cinemas/hooks/useCinemas';
import { useProfiles } from '../hooks/useProfiles';
import { BookingHeader } from '../components/BookingHeader';
import { BookingList } from '../components/BookingList';
import { PosBookingModal } from '../components/PosBookingModal';
import { TicketDetailModal } from '../components/TicketDetailModal';
import { CancelBookingDialog } from '../components/CancelBookingDialog';
import type { Booking, CreateBookingPayload } from '../../../types';

export const BookingsPage: React.FC = () => {
  const { data: bookings = [], isLoading: isLoadingBookings } = useBookings();
  const { data: showtimes = [], isLoading: isLoadingShowtimes } = useShowtimes();
  const { data: cinemas = [], isLoading: isLoadingCinemas } = useCinemas();
  const { data: profiles = [], isLoading: isLoadingProfiles } = useProfiles();

  const createBookingMutation = useCreateBooking();
  const cancelBookingMutation = useCancelBooking();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cinemaFilter, setCinemaFilter] = useState('all');

  const [isPosOpen, setIsPosOpen] = useState(false);
  const [viewingTicket, setViewingTicket] = useState<Booking | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        b.booking_code.toLowerCase().includes(search.toLowerCase()) ||
        (b.profile?.full_name &&
          b.profile.full_name.toLowerCase().includes(search.toLowerCase())) ||
        (b.showtime?.movie?.title &&
          b.showtime.movie.title.toLowerCase().includes(search.toLowerCase()));

      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchCinema =
        cinemaFilter === 'all' || b.showtime?.cinema_id === cinemaFilter;

      return matchSearch && matchStatus && matchCinema;
    });
  }, [bookings, search, statusFilter, cinemaFilter]);

  // Aggregate KPI metrics (only confirmed bookings count towards revenue)
  const { totalRevenue, totalSeatsSold, confirmedCount } = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === 'confirmed');
    const revenue = confirmed.reduce(
      (sum, b) => sum + (Number(b.total_amount) || 0),
      0
    );
    const seats = confirmed.reduce(
      (sum, b) => sum + (b.booking_seats?.length || 1),
      0
    );
    return {
      totalRevenue: revenue,
      totalSeatsSold: seats,
      confirmedCount: confirmed.length,
    };
  }, [bookings]);

  const handleCreatePosBooking = async (payload: CreateBookingPayload) => {
    const newBooking = await createBookingMutation.mutateAsync(payload);
    if (newBooking) {
      setViewingTicket(newBooking);
    }
  };

  const handleCancelBookingConfirm = async (id: string) => {
    await cancelBookingMutation.mutateAsync(id);
    setCancellingBooking(null);
  };

  const isLoading =
    isLoadingBookings ||
    isLoadingShowtimes ||
    isLoadingCinemas ||
    isLoadingProfiles;

  return (
    <div className="space-y-6">
      <BookingHeader
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        cinemaFilter={cinemaFilter}
        onCinemaFilterChange={setCinemaFilter}
        cinemas={cinemas}
        totalRevenue={totalRevenue}
        totalBookings={confirmedCount}
        totalSeatsSold={totalSeatsSold}
        onOpenPosModal={() => setIsPosOpen(true)}
      />

      <BookingList
        bookings={filteredBookings}
        isLoading={isLoading}
        onViewTicket={(b) => setViewingTicket(b)}
        onCancelBooking={(b) => setCancellingBooking(b)}
        onNewBooking={() => setIsPosOpen(true)}
      />

      {/* POS Box Office Modal */}
      <PosBookingModal
        isOpen={isPosOpen}
        showtimes={showtimes}
        profiles={profiles}
        onClose={() => setIsPosOpen(false)}
        onSubmit={handleCreatePosBooking}
        isLoading={createBookingMutation.isPending}
      />

      {/* E-Ticket Modal */}
      <TicketDetailModal
        isOpen={!!viewingTicket}
        booking={viewingTicket}
        onClose={() => setViewingTicket(null)}
      />

      {/* Cancel Confirmation Dialog */}
      <CancelBookingDialog
        isOpen={!!cancellingBooking}
        booking={cancellingBooking}
        onClose={() => setCancellingBooking(null)}
        onConfirm={handleCancelBookingConfirm}
        isLoading={cancelBookingMutation.isPending}
      />
    </div>
  );
};
