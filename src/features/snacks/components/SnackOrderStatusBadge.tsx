import React from 'react';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  BellRing,
  CheckCheck,
  Ban,
} from 'lucide-react';
import type { SnackOrderStatus } from '../../../types';

interface Props {
  status: SnackOrderStatus;
}

export const SnackOrderStatusBadge: React.FC<Props> = ({ status }) => {
  switch (status) {
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Clock className="w-3 h-3" />
          <span>Pending</span>
        </span>
      );
    case 'confirmed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <CheckCircle2 className="w-3 h-3" />
          <span>Confirmed</span>
        </span>
      );
    case 'preparing':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 animate-pulse">
          <ChefHat className="w-3 h-3" />
          <span>Preparing</span>
        </span>
      );
    case 'ready':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <BellRing className="w-3 h-3" />
          <span>Ready for Pickup</span>
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/60">
          <CheckCheck className="w-3 h-3 text-slate-400" />
          <span>Completed</span>
        </span>
      );
    case 'cancelled':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
          <Ban className="w-3 h-3" />
          <span>Cancelled</span>
        </span>
      );
    default:
      return null;
  }
};
