import React from 'react';
import { ImageUploader } from './ImageUploader';
import type { MovieInsert, MovieStatus } from '../../../types';

interface Props {
  formData: MovieInsert;
  onChange: (updates: Partial<MovieInsert>) => void;
}

export const MovieFormFields: React.FC<Props> = ({ formData, onChange }) => {
  return (
    <div className="space-y-3.5 max-h-[62vh] overflow-y-auto pr-1">
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
          <label className="block text-xs font-semibold text-slate-300 mb-1">Status *</label>
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
          <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Min) *</label>
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
          <label className="block text-xs font-semibold text-slate-300 mb-1">Genre</label>
          <input
            type="text"
            value={formData.genre || ''}
            onChange={(e) => onChange({ genre: e.target.value })}
            placeholder="Action, Sci-Fi"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Rating (0 - 10)</label>
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

      <ImageUploader
        label="Poster Image (Portrait)"
        value={formData.poster_url || ''}
        onChange={(url) => onChange({ poster_url: url })}
      />

      <ImageUploader
        label="Backdrop Banner (Landscape)"
        value={formData.backdrop_url || ''}
        onChange={(url) => onChange({ backdrop_url: url })}
      />

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
        <textarea
          rows={2}
          value={formData.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Synopsis and plot summary..."
          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none resize-none"
        />
      </div>
    </div>
  );
};
