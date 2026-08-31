import React, { useState } from 'react';
import { UploadCloud, Loader2, Link as LinkIcon } from 'lucide-react';
import { uploadMovieImage } from '../../../lib/storage';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label: string;
}

export const ImageUploader: React.FC<Props> = ({ value, onChange, label }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [useUrlMode, setUseUrlMode] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    try {
      const publicUrl = await uploadMovieImage(file);
      onChange(publicUrl);
    } catch (err: unknown) {
      const error = err as Error;
      setUploadError(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-300">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setUseUrlMode(!useUrlMode)}
          className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
        >
          {useUrlMode ? <UploadCloud className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />}
          <span>{useUrlMode ? 'Upload File' : 'Paste Direct URL'}</span>
        </button>
      </div>

      {useUrlMode ? (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none"
        />
      ) : (
        <div className="flex items-center gap-3">
          <label className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-slate-800/80 border border-dashed border-slate-700 hover:border-slate-500 rounded-xl text-xs text-slate-300 cursor-pointer transition-colors">
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
            ) : (
              <UploadCloud className="w-4 h-4 text-red-500" />
            )}
            <span>{isUploading ? 'Uploading to Supabase...' : 'Choose image to upload'}</span>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {value && (
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-700 shrink-0 bg-slate-900">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-[11px] text-red-400">{uploadError}</p>
      )}
    </div>
  );
};
