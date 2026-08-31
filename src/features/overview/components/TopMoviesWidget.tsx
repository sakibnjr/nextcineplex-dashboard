import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Star, ChevronRight } from 'lucide-react';
import { MovieStatusBadge } from '../../movies/components/MovieStatusBadge';
import type { Movie } from '../../../types';

interface Props {
  movies: Movie[];
  isLoading: boolean;
}

export const TopMoviesWidget: React.FC<Props> = ({ movies, isLoading }) => {
  const navigate = useNavigate();

  // Sort by rating descending
  const sortedMovies = [...movies]
    .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
    .slice(0, 4);

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
            <Film className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Top Rated Movies
            </h3>
          </div>

          <button
            type="button"
            onClick={() => navigate('/dashboard/movies')}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-0.5 font-semibold cursor-pointer"
          >
            <span>Catalog</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {sortedMovies.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No movies cataloged yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {sortedMovies.map((movie) => (
              <div
                key={movie.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                    {movie.poster_url ? (
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
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
                      {movie.title}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {movie.genre || 'General'} • {movie.duration_minutes}m
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{Number(movie.rating || 0).toFixed(1)}/10</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <MovieStatusBadge status={movie.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
