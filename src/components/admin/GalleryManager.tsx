'use client';

import { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import GalleryForm from './forms/GalleryForm';
import { deleteGalleryItem } from '@/app/actions/gallery';
import Image from 'next/image';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  createdAt: Date;
}

export default function GalleryManager({ initialData }: { initialData: GalleryItem[] }) {
  const [showForm, setShowForm] = useState(false);

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this image from the gallery?')) {
      await deleteGalleryItem(id);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Photo Gallery</h2>
          <p className="text-gray-500 text-sm mt-1">Manage images displayed in the public gallery.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition"
        >
          <Plus className="w-5 h-5 mr-1" />
          Add Image
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <GalleryForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {initialData.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
            No images in the gallery. Add one to get started!
          </div>
        ) : (
          initialData.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {/* Fallback pattern while image loads or if URL breaks */}
                <ImageIcon className="absolute w-12 h-12 text-gray-300" />
                
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=500&auto=format&fit=crop&q=60';
                  }}
                />
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all"
                    title="Delete Image"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-900 truncate">{item.title}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-pink-50 text-pink-700 border border-pink-100">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
