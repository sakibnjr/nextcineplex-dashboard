import React, { useState } from 'react';
import { X, Save, Popcorn, AlertCircle } from 'lucide-react';
import { ImageUploader } from '../../movies/components/ImageUploader';
import type { Snack, SnackInsert } from '../../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SnackInsert) => Promise<void>;
  initialData?: Snack | null;
  isLoading: boolean;
}

const defaultSnackState: SnackInsert = {
  name: '',
  category: 'Popcorn',
  price: 350,
  description: '',
  image_url: '',
  is_available: true,
};

const CATEGORIES = [
  'Popcorn',
  'Beverages',
  'Combos',
  'Hot Dogs & Nachos',
  'Candies & Treats',
  'Bakery & Desserts',
];

const getInitialFormData = (data?: Snack | null): SnackInsert => {
  if (data) {
    return {
      name: data.name,
      category: data.category,
      price: data.price,
      description: data.description || '',
      image_url: data.image_url || '',
      is_available: data.is_available,
    };
  }
  return defaultSnackState;
};

interface ContentProps {
  initialData?: Snack | null;
  onClose: () => void;
  onSubmit: (data: SnackInsert) => Promise<void>;
  isLoading: boolean;
}

const SnackFormModalContent: React.FC<ContentProps> = ({
  initialData,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<SnackInsert>(() =>
    getInitialFormData(initialData)
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Snack item name is required.');
      return;
    }
    if (formData.price < 0) {
      setErrorMsg('Price cannot be negative.');
      return;
    }

    setErrorMsg(null);
    try {
      await onSubmit(formData);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Failed to save snack item');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <Popcorn className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">
              {initialData ? 'Edit Menu Item' : 'Add Concession Item'}
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
          {/* Item Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Caramel Butter Popcorn (Large)"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none transition-colors"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none transition-colors cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Price (৳) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="10"
                min="0"
                required
                placeholder="350"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Freshly popped gourmet corn smothered in hot salted butter glaze."
              value={formData.description || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none transition-colors resize-none"
            />
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <span className="text-xs font-semibold text-white block">
                In Stock & Available
              </span>
              <span className="text-[11px] text-slate-400">
                Show item for ordering on POS and customer app
              </span>
            </div>
            <input
              type="checkbox"
              checked={formData.is_available}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_available: e.target.checked,
                }))
              }
              className="w-4 h-4 accent-red-600 rounded cursor-pointer"
            />
          </div>

          {/* Image Uploader */}
          <ImageUploader
            label="Snack / Product Photo"
            value={formData.image_url || ''}
            onChange={(url) =>
              setFormData((prev) => ({ ...prev, image_url: url }))
            }
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
              <span>{isLoading ? 'Saving...' : initialData ? 'Update Item' : 'Add Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const SnackFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <SnackFormModalContent
      key={initialData?.id ?? 'create'}
      initialData={initialData}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  );
};
