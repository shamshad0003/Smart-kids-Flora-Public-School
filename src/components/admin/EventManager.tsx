'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit, Calendar, MapPin } from 'lucide-react';
import EventForm from './forms/EventForm';
import { deleteEvent } from '@/app/actions/events';

interface EventData {
  id: string;
  title: string;
  description: string;
  location: string;
  eventDate: Date;
}

export default function EventManager({ initialData }: { initialData: EventData[] }) {
  const [showForm, setShowForm] = useState(false);

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(id);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Events</h2>
          <p className="text-gray-500 text-sm mt-1">Manage upcoming school events and calendar activities.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          <Plus className="w-5 h-5 mr-1" />
          Add Event
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <EventForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {initialData.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
            No events scheduled. Add one to get started!
          </div>
        ) : (
          initialData.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{item.title}</h3>
                <div className="flex space-x-2 shrink-0 ml-2">
                  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 mb-4 text-sm text-gray-600 grow">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                  <span>{new Date(item.eventDate).toLocaleString(undefined, {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 line-clamp-3 bg-gray-50 p-3 rounded-md border border-gray-100">
                {item.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
