import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  CheckCircle2,
  UtensilsCrossed,
  MapPin,
  User,
  Calendar,
} from 'lucide-react';
import { SnackOrderStatusBadge } from './SnackOrderStatusBadge';
import type { SnackOrder } from '../../../types';

interface Props {
  isOpen: boolean;
  order: SnackOrder | null;
  onClose: () => void;
}

export const SnackOrderDetailModal: React.FC<Props> = ({
  isOpen,
  order,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.order_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const orderDate = new Date(order.created_at);
  const formattedDate = orderDate.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = orderDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative print:border-none print:shadow-none print:w-full print:bg-white print:text-black">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 print:hidden">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-amber-500" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Concession Order Receipt
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

        {/* Order Details Body */}
        <div className="p-6 space-y-5">
          {/* Code Banner */}
          <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Order Slip Ref
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black tracking-wider text-white font-mono">
                  {order.order_code}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                  title="Copy order code"
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <SnackOrderStatusBadge status={order.status} />
          </div>

          {/* Location & Customer Info */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div>
              <span className="text-slate-500 font-medium block">Customer</span>
              <div className="flex items-center gap-1.5 mt-1 text-white font-semibold">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{order.profile?.full_name || 'Walk-in Guest'}</span>
              </div>
              {order.profile?.phone && (
                <span className="text-[11px] text-slate-400">{order.profile.phone}</span>
              )}
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Cinema Counter</span>
              <div className="flex items-center gap-1.5 mt-1 text-white font-semibold">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>{order.cinema?.name}</span>
              </div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-slate-500" />
                {formattedDate} {formattedTime}
              </span>
            </div>
          </div>

          {/* Itemized Food List */}
          <div className="space-y-2 pt-3 border-t border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Ordered Items
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold flex items-center justify-center text-[11px]">
                        {item.quantity}x
                      </span>
                      <div>
                        <span className="font-semibold text-white block">
                          {item.snack?.name || 'Concession Item'}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          ৳{Number(item.unit_price).toFixed(2)} each
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-400">
                      ৳{Number(item.subtotal).toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500">No items listed.</div>
              )}
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-slate-900/80 rounded-2xl p-4 flex items-center justify-between border border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 block">Total Paid</span>
              <span className="text-xs text-slate-500">
                {order.items?.reduce((sum, i) => sum + i.quantity, 0) || 1} Total Items
              </span>
            </div>
            <span className="text-2xl font-black text-emerald-400">
              ৳{Number(order.total_amount).toFixed(2)}
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
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-lg shadow-amber-600/20 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt Slip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
