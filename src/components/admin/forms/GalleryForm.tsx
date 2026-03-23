'use client';

import { useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { createGalleryItem } from '@/app/actions/gallery';

export default function GalleryForm({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await createGalleryItem(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      onSuccess();
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4 text-pink-600">Add Gallery Image</h3>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 text-sm mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-1">Image Title</label>
            <input 
              type="text" 
              id="title"
              name="title" 
              required 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-slate-50 transition-all"
              placeholder="e.g., Annual Sports Day 2026"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-1">Category</label>
            <select 
              id="category"
              name="category" 
              required 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-slate-50 transition-all"
            >
              <option value="Campus">Campus</option>
              <option value="Academics">Academics</option>
              <option value="Sports">Sports</option>
              <option value="Events">Events</option>
              <option value="Facilities">Facilities</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700 mb-1">Choose Image File</label>
          <div className="relative border-2 border-dashed border-slate-200 rounded-3xl p-4 transition-all hover:border-pink-300 group bg-slate-50 overflow-hidden min-h-[160px] flex flex-col items-center justify-center">
            {preview ? (
              <div className="relative w-full h-full min-h-[140px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                <button 
                  type="button" 
                  onClick={() => setPreview(null)}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-pink-600" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold text-pink-600">Click to upload</span>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG or WebP (Max 5MB)</p>
                </div>
                <input 
                  type="file" 
                  name="imageFile" 
                  accept="image/*" 
                  required 
                  onChange={handleFileChange}
                  className="hidden" 
                />
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button 
          type="button" 
          onClick={onSuccess}
          className="mr-3 px-6 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="px-8 py-2.5 text-sm font-bold text-white bg-pink-600 rounded-xl hover:bg-pink-700 transition-all shadow-lg shadow-pink-200 disabled:opacity-50 flex items-center space-x-2"
        >
          <span>{loading ? 'Uploading...' : 'Upload & Save Image'}</span>
        </button>
      </div>
    </form>
  );
}
