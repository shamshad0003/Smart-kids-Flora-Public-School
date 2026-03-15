'use client';

import { useState } from 'react';
import { createAnnouncement } from '@/app/actions/announcements';

export default function AnnouncementForm({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    
    // Convert checkbox to string value expected by the action
    formData.set('published', formData.get('published') ? 'true' : 'false');

    const result = await createAnnouncement(formData);

    if (result.error) {
      setError(result.error);
    } else {
      onSuccess();
    }
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Announcement</h3>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input 
          type="text" 
          id="title"
          name="title" 
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Annual Sports Day"
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
          <option value="Academics">Academics</option>
          <option value="Sports">Sports</option>
          <option value="Events">Events</option>
        </select>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
        <textarea 
          id="content"
          name="content" 
          required 
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Announcement details..."
        ></textarea>
      </div>

      <div className="flex items-center">
        <input 
          type="checkbox" 
          id="published" 
          name="published" 
          defaultChecked 
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
          Publish immediately
        </label>
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
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none disabled:bg-blue-400"
        >
          {loading ? 'Saving...' : 'Save Announcement'}
        </button>
      </div>
    </form>
  );
}
