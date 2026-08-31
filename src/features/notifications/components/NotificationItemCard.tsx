import React from 'react';
import { Ticket, Popcorn, Clock, ChevronRight } from 'lucide-react';
import type { NotificationItem } from '../types';

interface Props {
  item: NotificationItem;
  onClick: (path: string) => void;
}

export const NotificationItemCard: React.FC<Props> = ({ item, onClick }) => {
  const isTicket = item.type === 'ticket';

  return (
    <button
      type="button"
      onClick={() => onClick(item.path)}
      className="w-full text-left p-3 hover:bg-slate-900 dark:hover:bg-slate-900 transition-colors flex items-start gap-3 group cursor-pointer"
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
          isTicket
            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
        }`}
      >
        {isTicket ? (
          <Ticket className="w-4 h-4" />
        ) : (
          <Popcorn className="w-4 h-4" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs font-bold text-white group-hover:text-red-500 transition-colors truncate">
            {item.title}
          </span>
          <span className="text-[10px] text-slate-500 shrink-0 flex items-center gap-0.5 font-mono">
            <Clock className="w-2.5 h-2.5" />
            {item.time}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
          {item.message}
        </p>
      </div>

      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 shrink-0 self-center transition-colors" />
    </button>
  );
};
