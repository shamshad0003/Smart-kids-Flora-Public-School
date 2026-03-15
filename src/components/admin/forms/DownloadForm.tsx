'use client';

import { useState } from 'react';
import { createDownload } from '@/app/actions/downloads';

export default function DownloadForm({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await createDownload(formData);

    if (result.error) {
      setError(result.error);
    } else {
      onSuccess();
    }
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Downloadable File</h3>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
        <input 
          type="text" 
          id="title"
          name="title" 
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Prospectus 2026"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select 
          id="category"
          name="category" 
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="General">General</option>
          <option value="Admissions">Admissions</option>
          <option value="Syllabus">Syllabus</option>
          <option value="Forms">Forms</option>
        </select>
      </div>

      <div>
        <label htmlFor="fileUrl" className="block text-sm font-medium text-gray-700 mb-1">File URL (Google Drive / S3 link)</label>
        <input 
          type="url" 
          id="fileUrl"
          name="fileUrl" 
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://..."
        />
      </div>

      <div className="pt-4 flex justify-end">
        <button 
          type="button" 
          onClick={onSuccess}
          className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-400"
        >
          {loading ? 'Saving...' : 'Save File Link'}
        </button>
      </div>
    </form>
  );
}
