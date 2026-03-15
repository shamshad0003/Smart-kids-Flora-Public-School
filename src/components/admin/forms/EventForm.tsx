'use client';

import { useState } from 'react';
import { createEvent } from '@/app/actions/events';

export default function EventForm({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await createEvent(formData);

    if (result.error) {
      setError(result.error);
    } else {
      onSuccess();
    }
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Event</h3>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
        <input 
          type="text" 
          id="title"
          name="title" 
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Annual Science Fair"
        />
      </div>

      <div>
        <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
        <input 
          type="datetime-local" 
          id="eventDate"
          name="eventDate" 
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input 
          type="text" 
          id="location"
          name="location" 
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Main Auditorium"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea 
          id="description"
          name="description" 
          required 
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Event details..."
        ></textarea>
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
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none disabled:bg-green-400"
        >
          {loading ? 'Saving...' : 'Save Event'}
        </button>
      </div>
    </form>
  );
}
