import React, { useMemo } from 'react';
import { Calendar, Plus, Clock } from 'lucide-react';
import { ShowtimeCard } from './ShowtimeCard';
import type { Showtime, ShowtimeStatus } from '../../../types';

interface Props {
  showtimes: Showtime[];
  isLoading: boolean;
  onEdit: (showtime: Showtime) => void;
  onDelete: (showtime: Showtime) => void;
  onStatusChange: (id: string, status: ShowtimeStatus) => void;
  onAddShowtime: () => void;
}

export const ShowtimeList: React.FC<Props> = ({
  showtimes,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
  onAddShowtime,
}) => {
  // Group showtimes by formatted date
  const groupedByDate = useMemo(() => {
    const groups: { dateKey: string; label: string; items: Showtime[] }[] = [];
    const map = new Map<string, Showtime[]>();

    const sorted = [...showtimes].sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

    sorted.forEach((st) => {
      const date = new Date(st.start_time);
      const dateKey = date.toISOString().split('T')[0];
      const existing = map.get(dateKey) || [];
      existing.push(st);
      map.set(dateKey, existing);
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    Array.from(map.keys()).forEach((key) => {
      let label = new Date(key + 'T00:00:00').toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      if (key === todayStr) {
        label = `Today (${label})`;
      } else if (key === tomorrowStr) {
        label = `Tomorrow (${label})`;
      }

      groups.push({
        dateKey: key,
        label,
        items: map.get(key) || [],
      });
    });

    return groups;
  }, [showtimes]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 h-24 animate-pulse flex items-center justify-between"
          >
            <div className="flex items-center gap-3 w-1/2">
              <div className="w-14 h-16 bg-slate-800/60 rounded-xl" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-800/80 rounded w-3/4" />
                <div className="h-3 bg-slate-800/40 rounded w-1/2" />
              </div>
            </div>
            <div className="h-8 bg-slate-800/50 rounded-xl w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (showtimes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-bold text-white">No Screenings Scheduled</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
          There are no scheduled showtimes matching your filters. Schedule a new movie screening to open ticket sales.
        </p>
        <button
          type="button"
          onClick={onAddShowtime}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-red-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule First Screening</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupedByDate.map((group) => (
        <div key={group.dateKey} className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Clock className="w-4 h-4 text-red-500" />
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {group.label}
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
              {group.items.length} {group.items.length === 1 ? 'Show' : 'Shows'}
            </span>
          </div>

          <div className="space-y-2.5">
            {group.items.map((st) => (
              <ShowtimeCard
                key={st.id}
                showtime={st}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
