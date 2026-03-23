'use client';

import { useState } from 'react';
import { Upload, X, FileIcon } from 'lucide-react';
import { createDownload } from '@/app/actions/downloads';

export default function DownloadForm({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  }

  function handleRemove() {
    setFileName(null);
    const fileInput = document.getElementById('documentFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await createDownload(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      onSuccess();
    }
  }

  return (
    <form 
      action={handleSubmit} 
      encType="multipart/form-data"
      className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
    >
      <h3 className="text-lg font-bold text-slate-900 mb-4 text-indigo-600">Upload New Resource</h3>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 text-sm mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-1">Document Title</label>
            <input 
              type="text" 
              id="title"
              name="title" 
              required 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-all font-medium"
              placeholder="e.g., Prospectus 2026 / Syllabus"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-1">Category</label>
            <select 
              id="category"
              name="category" 
              required 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-all font-medium"
            >
              <option value="General">General</option>
              <option value="Admissions">Admissions</option>
              <option value="Syllabus">Syllabus</option>
              <option value="Forms">Forms</option>
              <option value="Results">Results</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700 mb-1">Choose File (PDF/DOC/ZIP)</label>
          <div className="relative border-2 border-dashed border-slate-200 rounded-3xl p-4 transition-all hover:border-indigo-300 group bg-slate-50 min-h-[160px] flex flex-col items-center justify-center">
            {fileName ? (
              <div className="flex flex-col items-center justify-center p-4 w-full">
                <FileIcon className="w-10 h-10 text-indigo-600 mb-2" />
                <p className="text-xs font-bold text-slate-700 truncate max-w-[200px]">{fileName}</p>
                <button 
                  type="button" 
                  onClick={handleRemove}
                  className="mt-3 flex items-center space-x-1 text-xs text-red-500 font-bold hover:text-red-700 transition-colors"
                >
                  <X className="w-3 h-3" />
                  <span>Remove file</span>
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-4 w-full">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold text-indigo-600">Click to upload file</span>
                  <p className="text-xs text-slate-400 mt-1">PDF, DOC, ZIP (Max 10MB)</p>
                </div>
                <input 
                  type="file" 
                  id="documentFile"
                  name="documentFile" 
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
          className="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center space-x-2"
        >
          <span>{loading ? 'Uploading...' : 'Save Document'}</span>
        </button>
      </div>
    </form>
  );
}
