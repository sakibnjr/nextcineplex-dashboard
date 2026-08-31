import React from 'react';
import { Clock, Star, Edit2, Trash2, Calendar } from 'lucide-react';
import { MovieStatusBadge } from './MovieStatusBadge';
import type { Movie } from '../../../types';

interface Props {
  movie: Movie;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
}

export const MovieCard: React.FC<Props> = ({ movie, onEdit, onDelete }) => {
  return (
    <div className="group bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-lg transition-all duration-200 flex flex-col">
      {/* Poster image container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        <img
          src={movie.backdrop_url || movie.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
        <div className="absolute top-3 left-3">
          <MovieStatusBadge status={movie.status} />
        </div>
        {movie.rating && (
          <div className="absolute bottom-2 left-3 flex items-center gap-1 text-xs font-bold text-amber-400 bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-slate-800">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{movie.rating}</span>
          </div>
        )}
      </div>

      {/* Info Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-sm text-white line-clamp-1 leading-snug">
            {movie.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {movie.description || 'No description provided.'}
          </p>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800/60">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{movie.duration_minutes}m</span>
            </div>
            {movie.release_date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>{new Date(movie.release_date).toLocaleDateString()}</span>
              </div>
            )}
            {movie.genre && (
              <span className="text-slate-400 font-medium truncate max-w-[120px]">
                {movie.genre.split(',')[0]}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-800/60">
          <button
            type="button"
            onClick={() => onEdit(movie)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(movie)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
