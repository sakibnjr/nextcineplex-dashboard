import React, { useState } from 'react';
import { X, Save, Building2, AlertCircle } from 'lucide-react';
import { ImageUploader } from '../../movies/components/ImageUploader';
import type { Cinema, CinemaInsert } from '../../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CinemaInsert) => Promise<void>;
  initialData?: Cinema | null;
  isLoading: boolean;
}

const defaultCinemaState: CinemaInsert = {
  name: '',
  city: '',
  address: '',
  description: '',
  image_url: '',
};

const getInitialFormData = (data?: Cinema | null): CinemaInsert => {
  if (data) {
    return {
      name: data.name,
      city: data.city,
      address: data.address,
      description: data.description || '',
      image_url: data.image_url || '',
    };
  }
  return defaultCinemaState;
};

interface ContentProps {
  initialData?: Cinema | null;
  onClose: () => void;
  onSubmit: (data: CinemaInsert) => Promise<void>;
  isLoading: boolean;
}

const CinemaFormModalContent: React.FC<ContentProps> = ({
  initialData,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<CinemaInsert>(() => getInitialFormData(initialData));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Cinema name is required.');
      return;
    }
    if (!formData.city.trim()) {
      setErrorMsg('City is required.');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMsg('Address is required.');
      return;
    }

    setErrorMsg(null);
    try {
      await onSubmit(formData);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Failed to save cinema');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-500/10 text-red-500 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">
              {initialData ? 'Edit Cinema Branch' : 'Add New Cinema Branch'}
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
          {/* Cinema Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Cinema Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. NextCineplex Downtown IMAX"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none transition-colors"
            />
          </div>

          {/* City & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. New York, Dhaka, London"
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Full Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Level 4, Grand City Center, 5th Ave"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Description / Amenities (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Premium Dolby Atmos 4K laser projection theater with reclining seats."
              value={formData.description || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none transition-colors resize-none"
            />
          </div>

          {/* Image Uploader */}
          <ImageUploader
            label="Cinema Branch Cover Image"
            value={formData.image_url || ''}
            onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
          />

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
              <span>{isLoading ? 'Saving...' : initialData ? 'Update Branch' : 'Create Branch'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const CinemaFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <CinemaFormModalContent
      key={initialData?.id ?? 'create'}
      initialData={initialData}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  );
};
