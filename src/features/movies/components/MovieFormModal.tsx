import React, { useState } from 'react';
import { X, Save, Film, AlertCircle } from 'lucide-react';
import { MovieFormFields } from './MovieFormFields';
import type { Movie, MovieInsert } from '../../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MovieInsert) => Promise<void>;
  initialData?: Movie | null;
  isLoading: boolean;
}

const defaultMovieState: MovieInsert = {
  title: '',
  description: '',
  poster_url: '',
  backdrop_url: '',
  trailer_url: '',
  duration_minutes: 120,
  release_date: '',
  genre: '',
  language: '',
  rating: 8.0,
  status: 'now_showing',
};

const getInitialFormData = (data?: Movie | null): MovieInsert => {
  if (data) {
    return {
      title: data.title,
      description: data.description || '',
      poster_url: data.poster_url || '',
      backdrop_url: data.backdrop_url || '',
      trailer_url: data.trailer_url || '',
      duration_minutes: data.duration_minutes,
      release_date: data.release_date || '',
      genre: data.genre || '',
      language: data.language || '',
      rating: data.rating ?? null,
      status: data.status,
    };
  }
  return defaultMovieState;
};

interface ModalContentProps {
  initialData?: Movie | null;
  onClose: () => void;
  onSubmit: (data: MovieInsert) => Promise<void>;
  isLoading: boolean;
}

const MovieFormModalContent: React.FC<ModalContentProps> = ({
  initialData,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<MovieInsert>(() => getInitialFormData(initialData));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await onSubmit(formData);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Failed to save movie');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-red-500" />
            <h2 className="text-base font-bold text-white">
              {initialData ? 'Edit Movie Details' : 'Add New Movie'}
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
          <MovieFormFields
            formData={formData}
            onChange={(updates) => setFormData((prev) => ({ ...prev, ...updates }))}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
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
              <span>{isLoading ? 'Saving...' : initialData ? 'Update Movie' : 'Create Movie'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const MovieFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <MovieFormModalContent
      key={initialData?.id ?? 'create'}
      initialData={initialData}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  );
};

