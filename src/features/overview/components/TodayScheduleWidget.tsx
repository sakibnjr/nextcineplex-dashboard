import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Film, ChevronRight } from 'lucide-react';
import { ShowtimeStatusBadge } from '../../showtimes/components/ShowtimeStatusBadge';
import type { Showtime } from '../../../types';

interface Props {
  showtimes: Showtime[];
  isLoading: boolean;
}

export const TodayScheduleWidget: React.FC<Props> = ({
  showtimes,
  isLoading,
}) => {
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];

  const todayShows = useMemo(() => {
    return showtimes.filter((st) => {
      const dateKey = new Date(st.start_time).toISOString().split('T')[0];
      return dateKey === todayStr;
    });
  }, [showtimes, todayStr]);

  const displayShows = todayShows.length > 0 ? todayShows : showtimes.slice(0, 5);

  if (isLoading) {
    return (
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
        <div className="h-4 bg-slate-800 rounded w-1/3 animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-800/50 rounded-xl animate-pulse" />
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
            <Calendar className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {todayShows.length > 0 ? "Today's Screenings" : "Upcoming Screenings"}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] font-semibold text-slate-300">
              {displayShows.length} Shows
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/dashboard/showtimes')}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-0.5 font-semibold cursor-pointer"
          >
            <span>All Showtimes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {displayShows.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No screenings scheduled for today.
          </div>
        ) : (
          <div className="space-y-2.5">
            {displayShows.slice(0, 4).map((st) => {
              const startDate = new Date(st.start_time);
              const formattedTime = startDate.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                      {st.movie?.poster_url ? (
                        <img
                          src={st.movie.poster_url}
                          alt={st.movie.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-700">
                          <Film className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <span className="font-bold text-xs text-white truncate block">
                        {st.movie?.title}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-400" />
                        {st.cinema?.name} ({st.cinema?.city})
                      </span>
                      <span className="text-[10px] text-amber-400 font-bold">
                        ৳{Number(st.ticket_price).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-md text-[11px] font-semibold text-slate-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-red-400" />
                      {formattedTime}
                    </span>
                    <ShowtimeStatusBadge status={st.status} />
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
