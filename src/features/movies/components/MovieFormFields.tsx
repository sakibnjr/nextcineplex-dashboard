import React from 'react';
import type { MovieInsert, MovieStatus } from '../../../types';

interface Props {
  formData: MovieInsert;
  onChange: (updates: Partial<MovieInsert>) => void;
}

export const MovieFormFields: React.FC<Props> = ({ formData, onChange }) => {
  return (
    <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">
          Movie Title *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Spider-Man: Brand New Day 3D"
          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Status *
          </label>
          <select
            value={formData.status}
            onChange={(e) => onChange({ status: e.target.value as MovieStatus })}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none cursor-pointer"
          >
            <option value="now_showing">Now Showing</option>
            <option value="upcoming">Upcoming</option>
            <option value="ended">Ended</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Duration (Minutes) *
          </label>
          <input
            type="number"
            required
            min={1}
            value={formData.duration_minutes || ''}
            onChange={(e) => onChange({ duration_minutes: Number(e.target.value) })}
            placeholder="148"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Genre
          </label>
          <input
            type="text"
            value={formData.genre || ''}
            onChange={(e) => onChange({ genre: e.target.value })}
            placeholder="Action, Sci-Fi, Adventure"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Rating (0 - 10)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={formData.rating ?? ''}
            onChange={(e) => onChange({ rating: e.target.value ? Number(e.target.value) : null })}
            placeholder="8.9"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Release Date
          </label>
          <input
            type="date"
            value={formData.release_date || ''}
            onChange={(e) => onChange({ release_date: e.target.value })}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Language / Format
          </label>
          <input
            type="text"
            value={formData.language || ''}
            onChange={(e) => onChange({ language: e.target.value })}
            placeholder="English (3D Dolby Atmos)"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">
          Backdrop / Banner URL
        </label>
        <input
          type="url"
          value={formData.backdrop_url || ''}
          onChange={(e) => onChange({ backdrop_url: e.target.value })}
          placeholder="https://images.unsplash.com/..."
          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">
          Description
        </label>
        <textarea
          rows={3}
          value={formData.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Synopsis and plot summary..."
          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none resize-none"
        />
      </div>
    </div>
  );
};
