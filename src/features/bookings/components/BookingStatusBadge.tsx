import React from 'react';
import { CheckCircle2, Ban } from 'lucide-react';
import type { BookingStatus } from '../../../types';

interface Props {
  status: BookingStatus;
}

export const BookingStatusBadge: React.FC<Props> = ({ status }) => {
  switch (status) {
    case 'confirmed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" />
          <span>Confirmed</span>
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
