import React, { useState, useMemo } from 'react';
import { useBookings } from '../../bookings/hooks/useBookings';
import { useSnacks } from '../../snacks/hooks/useSnacks';
import { useSnackOrders } from '../../snacks/hooks/useSnackOrders';
import { useShowtimes } from '../../showtimes/hooks/useShowtimes';
import { useMovies } from '../../movies/hooks/useMovies';
import { useCinemas } from '../../cinemas/hooks/useCinemas';
import { useProfiles } from '../../bookings/hooks/useProfiles';
import {
  useCreateBooking,
} from '../../bookings/hooks/useBookingMutations';
import {
  useCreateSnackOrder,
} from '../../snacks/hooks/useSnackMutations';
import { OverviewStatCards } from '../components/OverviewStatCards';
import { QuickActionsBar } from '../components/QuickActionsBar';
import { TodayScheduleWidget } from '../components/TodayScheduleWidget';
import { RecentTransactionsWidget } from '../components/RecentTransactionsWidget';
import { TopMoviesWidget } from '../components/TopMoviesWidget';
import { BranchDistributionWidget } from '../components/BranchDistributionWidget';
import { PosBookingModal } from '../../bookings/components/PosBookingModal';
import { PosSnackOrderModal } from '../../snacks/components/PosSnackOrderModal';
import { TicketDetailModal } from '../../bookings/components/TicketDetailModal';
import { SnackOrderDetailModal } from '../../snacks/components/SnackOrderDetailModal';
import type {
  Booking,
  SnackOrder,
  CreateBookingPayload,
  CreateSnackOrderPayload,
} from '../../../types';
import { Sparkles } from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const { data: bookings = [], isLoading: isLoadingBookings } = useBookings();
  const { data: snacks = [] } = useSnacks();
  const { data: snackOrders = [], isLoading: isLoadingSnacks } = useSnackOrders();
  const { data: showtimes = [], isLoading: isLoadingShowtimes } = useShowtimes();
  const { data: movies = [], isLoading: isLoadingMovies } = useMovies();
  const { data: cinemas = [], isLoading: isLoadingCinemas } = useCinemas();
  const { data: profiles = [] } = useProfiles();

  const createBookingMutation = useCreateBooking();
  const createSnackOrderMutation = useCreateSnackOrder();

  // Modal triggers from Quick Actions
  const [isPosBookingOpen, setIsPosBookingOpen] = useState(false);
  const [isPosSnackOpen, setIsPosSnackOpen] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<Booking | null>(null);
  const [createdSnackOrder, setCreatedSnackOrder] = useState<SnackOrder | null>(null);

  // Revenue & Statistics Aggregations
  const stats = useMemo(() => {
    const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
    const ticketRev = confirmedBookings.reduce(
      (sum, b) => sum + (Number(b.total_amount) || 0),
      0
    );
    const seatsSold = confirmedBookings.reduce(
      (sum, b) => sum + (b.booking_seats?.length || 1),
      0
    );

    const validSnackOrders = snackOrders.filter((o) => o.status !== 'cancelled');
    const snackRev = validSnackOrders.reduce(
      (sum, o) => sum + (Number(o.total_amount) || 0),
      0
    );

    const gross = ticketRev + snackRev;
    const capacity = cinemas.reduce((sum, c) => sum + (c.seats_count || 0), 0);

    return {
      totalGrossRevenue: gross,
      ticketRevenue: ticketRev,
      snackRevenue: snackRev,
      totalSeatsSold: seatsSold,
      totalBookings: confirmedBookings.length,
      totalSnackOrders: validSnackOrders.length,
      totalBranches: cinemas.length,
      totalCapacity: capacity,
    };
  }, [bookings, snackOrders, cinemas]);

  const handleCreatePosBooking = async (payload: CreateBookingPayload) => {
    const newBooking = await createBookingMutation.mutateAsync(payload);
    if (newBooking) {
      setCreatedTicket(newBooking);
    }
  };

  const handleCreateSnackOrder = async (payload: CreateSnackOrderPayload) => {
    const newOrder = await createSnackOrderMutation.mutateAsync(payload);
    if (newOrder) {
      setCreatedSnackOrder(newOrder);
    }
  };

  const isLoading =
    isLoadingBookings ||
    isLoadingSnacks ||
    isLoadingShowtimes ||
    isLoadingMovies ||
    isLoadingCinemas;

  const todayFormatted = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Executive Overview
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time box office analytics, concessions turnover, and theater network performance.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-slate-400 block font-mono">
            {todayFormatted}
          </span>
          <span className="text-[11px] text-emerald-400 font-medium flex items-center justify-end gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Network Connected
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <OverviewStatCards
        totalGrossRevenue={stats.totalGrossRevenue}
        ticketRevenue={stats.ticketRevenue}
        snackRevenue={stats.snackRevenue}
        totalSeatsSold={stats.totalSeatsSold}
        totalBookings={stats.totalBookings}
        totalSnackOrders={stats.totalSnackOrders}
        totalBranches={stats.totalBranches}
        totalCapacity={stats.totalCapacity}
        isLoading={isLoading}
      />

      {/* Quick POS & Action Bar */}
      <QuickActionsBar
        onOpenPosBooking={() => setIsPosBookingOpen(true)}
        onOpenPosSnack={() => setIsPosSnackOpen(true)}
      />

      {/* 2-Column Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col */}
        <div className="space-y-6">
          <TodayScheduleWidget
            showtimes={showtimes}
            isLoading={isLoadingShowtimes}
          />
          <TopMoviesWidget
            movies={movies}
            isLoading={isLoadingMovies}
          />
        </div>

        {/* Right Col */}
        <div className="space-y-6">
          <RecentTransactionsWidget
            bookings={bookings}
            snackOrders={snackOrders}
            isLoading={isLoadingBookings || isLoadingSnacks}
          />
          <BranchDistributionWidget
            cinemas={cinemas}
            isLoading={isLoadingCinemas}
          />
        </div>
      </div>

      {/* Quick Action POS Modals */}
      <PosBookingModal
        isOpen={isPosBookingOpen}
        showtimes={showtimes}
        profiles={profiles}
        onClose={() => setIsPosBookingOpen(false)}
        onSubmit={handleCreatePosBooking}
        isLoading={createBookingMutation.isPending}
      />

      <PosSnackOrderModal
        isOpen={isPosSnackOpen}
        snacks={snacks}
        cinemas={cinemas}
        profiles={profiles}
        onClose={() => setIsPosSnackOpen(false)}
        onSubmit={handleCreateSnackOrder}
        isLoading={createSnackOrderMutation.isPending}
      />

      {/* Ticket E-Receipt */}
      <TicketDetailModal
        isOpen={!!createdTicket}
        booking={createdTicket}
        onClose={() => setCreatedTicket(null)}
      />

      {/* Snack Receipt */}
      <SnackOrderDetailModal
        isOpen={!!createdSnackOrder}
        order={createdSnackOrder}
        onClose={() => setCreatedSnackOrder(null)}
      />
    </div>
  );
};
