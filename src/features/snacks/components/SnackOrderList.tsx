import React from 'react';
import {
  ShoppingBag,
  User,
  MapPin,
  Calendar,
  Eye,
  ChefHat,
  BellRing,
  CheckCheck,
  Ban,
  Plus,
} from 'lucide-react';
import { SnackOrderStatusBadge } from './SnackOrderStatusBadge';
import type { SnackOrder, SnackOrderStatus } from '../../../types';

interface Props {
  orders: SnackOrder[];
  isLoading: boolean;
  onViewOrder: (order: SnackOrder) => void;
  onStatusChange: (id: string, status: SnackOrderStatus) => void;
  onNewOrder: () => void;
}

export const SnackOrderList: React.FC<Props> = ({
  orders,
  isLoading,
  onViewOrder,
  onStatusChange,
  onNewOrder,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
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

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-bold text-white">No Concession Orders</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
          No food or beverage orders match your current filters. Place a new order at the counter.
        </p>
        <button
          type="button"
          onClick={onNewOrder}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Concession Order</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const orderDate = new Date(order.created_at);
        const formattedDate = orderDate.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        });
        const formattedTime = orderDate.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        });

        const totalItemsCount =
          order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

        return (
          <div
            key={order.id}
            className="bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-4 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg hover:shadow-xl hover:shadow-black/40"
          >
            {/* Order Code & Customer */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-6 h-6" />
              </div>

              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-white tracking-wider">
                    {order.order_code}
                  </span>
                  <SnackOrderStatusBadge status={order.status} />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-300">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    {order.profile?.full_name || 'Walk-in Customer'}
                  </span>
                  {order.profile?.phone && (
                    <span className="text-[11px] text-slate-500">
                      • {order.profile.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Location & Items Preview */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs border-y sm:border-y-0 border-slate-800/60 py-2 sm:py-0">
              <div className="space-y-0.5 min-w-[130px]">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-400" />
                  {order.cinema?.name}
                </span>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formattedDate} @ {formattedTime}
                </span>
              </div>

              {/* Items preview */}
              <div className="flex flex-wrap gap-1.5 max-w-xs">
                {order.items && order.items.length > 0 ? (
                  order.items.slice(0, 3).map((item) => (
                    <span
                      key={item.id}
                      className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-amber-300 font-semibold rounded-lg text-[11px]"
                    >
                      {item.quantity}x {item.snack?.name || 'Item'}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500">{totalItemsCount} items</span>
                )}
                {order.items && order.items.length > 3 && (
                  <span className="px-1.5 py-0.5 text-[10px] text-slate-500">
                    +{order.items.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Price & Actions */}
            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  Total
                </span>
                <span className="text-base font-black text-emerald-400">
                  ৳{Number(order.total_amount).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Kitchen Status Actions */}
                {order.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => onStatusChange(order.id, 'preparing')}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <ChefHat className="w-3.5 h-3.5" />
                    <span>Prepare</span>
                  </button>
                )}

                {order.status === 'preparing' && (
                  <button
                    type="button"
                    onClick={() => onStatusChange(order.id, 'ready')}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <BellRing className="w-3.5 h-3.5" />
                    <span>Ready</span>
                  </button>
                )}

                {order.status === 'ready' && (
                  <button
                    type="button"
                    onClick={() => onStatusChange(order.id, 'completed')}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Complete</span>
                  </button>
                )}

                {/* View Receipt */}
                <button
                  type="button"
                  onClick={() => onViewOrder(order)}
                  title="View order receipt"
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/40 rounded-xl transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {/* Cancel if not completed/cancelled */}
                {order.status !== 'completed' && order.status !== 'cancelled' && (
                  <button
                    type="button"
                    onClick={() => onStatusChange(order.id, 'cancelled')}
                    title="Cancel order"
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
