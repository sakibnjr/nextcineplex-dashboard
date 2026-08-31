import React from 'react';
import { Film, Loader2 } from 'lucide-react';
import { MovieCard } from './MovieCard';
import type { Movie } from '../../../types';

interface Props {
  movies: Movie[];
  isLoading: boolean;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
}

export const MovieList: React.FC<Props> = ({
  movies,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        <span className="text-sm font-medium">Loading movies from database...</span>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center p-8 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-3">
          <Film className="w-6 h-6 text-slate-500" />
        </div>
        <h3 className="text-sm font-bold text-slate-300">No movies found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Try adjusting your search criteria or add a new movie to the catalog.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
