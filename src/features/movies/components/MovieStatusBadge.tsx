import React from 'react';
import type { MovieStatus } from '../../../types';

interface Props {
  status: MovieStatus;
}

export const MovieStatusBadge: React.FC<Props> = ({ status }) => {
  const styles: Record<MovieStatus, { bg: string; text: string; label: string; dot: string }> = {
    now_showing: {
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      text: 'text-emerald-400',
      label: 'Now Showing',
      dot: 'bg-emerald-400',
    },
    upcoming: {
      bg: 'bg-amber-500/10 border-amber-500/30',
      text: 'text-amber-400',
      label: 'Upcoming',
      dot: 'bg-amber-400',
    },
    ended: {
      bg: 'bg-slate-500/10 border-slate-500/30',
      text: 'text-slate-400',
      label: 'Ended',
      dot: 'bg-slate-400',
    },
  };

  const current = styles[status] || styles.upcoming;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${current.bg} ${current.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
};
