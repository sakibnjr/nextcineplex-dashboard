import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Popcorn, Activity, ChevronRight } from 'lucide-react';
import type { Booking, SnackOrder } from '../../../types';

interface ActivityItem {
  id: string;
  type: 'ticket' | 'snack';
  code: string;
  title: string;
  customer: string;
  amount: number;
  date: Date;
  status: string;
}

interface Props {
  bookings: Booking[];
  snackOrders: SnackOrder[];
  isLoading: boolean;
}

export const RecentTransactionsWidget: React.FC<Props> = ({
  bookings,
  snackOrders,
  isLoading,
}) => {
  const navigate = useNavigate();

  const activities: ActivityItem[] = useMemo(() => {
    const list: ActivityItem[] = [];

    bookings.slice(0, 8).forEach((b) => {
      list.push({
        id: b.id,
        type: 'ticket',
        code: b.booking_code,
        title: `${b.showtime?.movie?.title || 'Screening'} (${b.booking_seats?.length || 1} seats)`,
        customer: b.profile?.full_name || 'Walk-in Guest',
        amount: Number(b.total_amount),
        date: new Date(b.created_at),
        status: b.status,
      });
    });

    snackOrders.slice(0, 8).forEach((o) => {
      const totalItems =
        o.items?.reduce((sum, item) => sum + item.quantity, 0) || 1;
      list.push({
        id: o.id,
        type: 'snack',
        code: o.order_code,
        title: `Concessions (${totalItems} items)`,
        customer: o.profile?.full_name || 'Walk-in Customer',
        amount: Number(o.total_amount),
        date: new Date(o.created_at),
        status: o.status,
      });
    });

    return list.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
  }, [bookings, snackOrders]);

  if (isLoading) {
    return (
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
        <div className="h-4 bg-slate-800 rounded w-1/3 animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-slate-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent Activity Feed
            </h3>
          </div>

          <button
            type="button"
            onClick={() => navigate('/dashboard/bookings')}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-0.5 font-semibold cursor-pointer"
          >
            <span>All Bookings</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activities.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No recent activity recorded yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {activities.map((act) => {
              const formattedTime = act.date.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              });

              const isTicket = act.type === 'ticket';

              return (
                <div
                  key={`${act.type}-${act.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isTicket
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {isTicket ? (
                        <Ticket className="w-4 h-4" />
                      ) : (
                        <Popcorn className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-white">
                          {act.code}
                        </span>
                        <span className="text-[10px] text-slate-500">• {formattedTime}</span>
                      </div>
                      <span className="text-xs text-slate-300 font-medium truncate block">
                        {act.title}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        By {act.customer}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-emerald-400 block">
                      +৳{act.amount.toFixed(2)}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      {act.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
