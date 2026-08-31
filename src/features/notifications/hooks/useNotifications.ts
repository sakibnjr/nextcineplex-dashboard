import { useMemo, useState } from 'react';
import { useBookings } from '../../bookings/hooks/useBookings';
import { useSnackOrders } from '../../snacks/hooks/useSnackOrders';
import type { NotificationItem } from '../types';

export const useNotifications = () => {
  const [hasRead, setHasRead] = useState(false);
  const { data: bookings = [], isLoading: isLoadingBookings } = useBookings();
  const { data: snackOrders = [], isLoading: isLoadingSnacks } = useSnackOrders();

  const notifications: NotificationItem[] = useMemo(() => {
    const list: NotificationItem[] = [];

    bookings.slice(0, 4).forEach((b) => {
      const seatsCount = b.booking_seats?.length || 1;
      list.push({
        id: `b-${b.id}`,
        type: 'ticket',
        title: `New Ticket Booking (${b.booking_code})`,
        message: `${b.profile?.full_name || 'Customer'} reserved ${seatsCount} seat${seatsCount > 1 ? 's' : ''} for ${b.showtime?.movie?.title || 'Screening'}`,
        time: new Date(b.created_at).toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        }),
        path: '/dashboard/bookings',
        date: new Date(b.created_at),
      });
    });

    snackOrders.slice(0, 4).forEach((o) => {
      const itemsCount =
        o.items?.reduce((sum, item) => sum + item.quantity, 0) || 1;
      list.push({
        id: `s-${o.id}`,
        type: 'snack',
        title: `Concession Order (${o.order_code})`,
        message: `${itemsCount} item${itemsCount > 1 ? 's' : ''} ordered at ${o.cinema?.name || 'Counter'} (Status: ${o.status})`,
        time: new Date(o.created_at).toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        }),
        path: '/dashboard/snacks',
        date: new Date(o.created_at),
      });
    });

    return list.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 6);
  }, [bookings, snackOrders]);

  const unreadCount = hasRead ? 0 : Math.min(notifications.length, 5);

  const markAllRead = () => {
    setHasRead(true);
  };

  return {
    notifications,
    unreadCount,
    markAllRead,
    isLoading: isLoadingBookings || isLoadingSnacks,
  };
};
