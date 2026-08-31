import React, { useState } from 'react';
import { X, Save, Calendar, AlertCircle, Film, Building2, Clock } from 'lucide-react';
import type {
  Showtime,
  ShowtimeInsert,
  ShowtimeStatus,
  Movie,
  Cinema,
} from '../../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ShowtimeInsert) => Promise<void>;
  initialData?: Showtime | null;
  movies: Movie[];
  cinemas: Cinema[];
  isLoading: boolean;
}

// Convert ISO string or Date to "YYYY-MM-DDTHH:MM" for datetime-local input
const toDatetimeLocal = (dateStr?: string | null): string => {
  if (!dateStr) {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 60); // Default to 1 hour from now
    d.setMinutes(0, 0, 0); // Round to hour
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  }
  const d = new Date(dateStr);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};

const getInitialFormData = (
  data?: Showtime | null,
  movies: Movie[] = [],
  cinemas: Cinema[] = []
): ShowtimeInsert => {
  if (data) {
    return {
      movie_id: data.movie_id,
      cinema_id: data.cinema_id,
      start_time: data.start_time,
      end_time: data.end_time,
      ticket_price: data.ticket_price,
      status: data.status,
    };
  }

  const defaultStart = new Date();
  defaultStart.setHours(defaultStart.getHours() + 2, 0, 0, 0);
  const defaultEnd = new Date(defaultStart.getTime() + 135 * 60000); // 2h 15m default

  return {
    movie_id: movies[0]?.id || '',
    cinema_id: cinemas[0]?.id || '',
    start_time: defaultStart.toISOString(),
    end_time: defaultEnd.toISOString(),
    ticket_price: 12.5,
    status: 'scheduled',
  };
};

interface ContentProps {
  initialData?: Showtime | null;
  movies: Movie[];
  cinemas: Cinema[];
  onClose: () => void;
  onSubmit: (data: ShowtimeInsert) => Promise<void>;
  isLoading: boolean;
}

const ShowtimeFormModalContent: React.FC<ContentProps> = ({
  initialData,
  movies,
  cinemas,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<ShowtimeInsert>(() =>
    getInitialFormData(initialData, movies, cinemas)
  );
  const [startInput, setStartInput] = useState<string>(() =>
    toDatetimeLocal(initialData?.start_time)
  );
  const [endInput, setEndInput] = useState<string>(() =>
    toDatetimeLocal(initialData?.end_time)
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Selected movie reference
  const selectedMovie = movies.find((m) => m.id === formData.movie_id);

  // Handle smart auto-calculation of end time
  const handleStartTimeChange = (newStartVal: string) => {
    setStartInput(newStartVal);
    const startDate = new Date(newStartVal);
    if (!isNaN(startDate.getTime())) {
      setFormData((prev) => ({
        ...prev,
        start_time: startDate.toISOString(),
      }));

      // Calculate end time automatically based on movie duration + 15 min buffer
      const durationMins = selectedMovie?.duration_minutes || 120;
      const calculatedEndDate = new Date(
        startDate.getTime() + (durationMins + 15) * 60000
      );
      setEndInput(toDatetimeLocal(calculatedEndDate.toISOString()));
      setFormData((prev) => ({
        ...prev,
        end_time: calculatedEndDate.toISOString(),
      }));
    }
  };

  const handleMovieChange = (movieId: string) => {
    setFormData((prev) => ({ ...prev, movie_id: movieId }));
    const movie = movies.find((m) => m.id === movieId);
    const startDate = new Date(startInput);
    if (movie && !isNaN(startDate.getTime())) {
      const durationMins = movie.duration_minutes || 120;
      const calculatedEndDate = new Date(
        startDate.getTime() + (durationMins + 15) * 60000
      );
      setEndInput(toDatetimeLocal(calculatedEndDate.toISOString()));
      setFormData((prev) => ({
        ...prev,
        end_time: calculatedEndDate.toISOString(),
      }));
    }
  };

  const handleEndTimeChange = (newEndVal: string) => {
    setEndInput(newEndVal);
    const endDate = new Date(newEndVal);
    if (!isNaN(endDate.getTime())) {
      setFormData((prev) => ({
        ...prev,
        end_time: endDate.toISOString(),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.movie_id) {
      setErrorMsg('Please select a movie.');
      return;
    }
    if (!formData.cinema_id) {
      setErrorMsg('Please select a cinema auditorium.');
      return;
    }

    const start = new Date(formData.start_time).getTime();
    const end = new Date(formData.end_time).getTime();

    if (isNaN(start) || isNaN(end)) {
      setErrorMsg('Please provide valid start and end times.');
      return;
    }

    if (end <= start) {
      setErrorMsg('End time must be after start time.');
      return;
    }

    if (formData.ticket_price < 0) {
      setErrorMsg('Ticket price cannot be negative.');
      return;
    }

    setErrorMsg(null);
    try {
      await onSubmit(formData);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Failed to save showtime');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-500/10 text-red-500 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">
              {initialData ? 'Edit Screening Schedule' : 'Schedule Movie Screening'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Movie */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Select Movie <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                required
                value={formData.movie_id}
                onChange={(e) => handleMovieChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none transition-colors appearance-none cursor-pointer"
              >
                {movies.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.duration_minutes} mins)
                  </option>
                ))}
              </select>
              <Film className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Select Cinema */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Cinema Branch / Hall <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                required
                value={formData.cinema_id}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, cinema_id: e.target.value }))
                }
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none transition-colors appearance-none cursor-pointer"
              >
                {cinemas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.city}
                  </option>
                ))}
              </select>
              <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Start Time & End Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={startInput}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">
                  End Time <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Auto-calculated
                </span>
              </div>
              <input
                type="datetime-local"
                required
                value={endInput}
                onChange={(e) => handleEndTimeChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none transition-colors"
              />
            </div>
          </div>

          {/* Ticket Price & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Base Ticket Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.50"
                min="0"
                required
                placeholder="12.50"
                value={formData.ticket_price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ticket_price: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as ShowtimeStatus,
                  }))
                }
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none transition-colors cursor-pointer"
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl shadow-lg shadow-red-600/20 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : initialData ? 'Update Showtime' : 'Schedule Showtime'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ShowtimeFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  movies,
  cinemas,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <ShowtimeFormModalContent
      key={initialData?.id ?? 'create'}
      initialData={initialData}
      movies={movies}
      cinemas={cinemas}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  );
};
