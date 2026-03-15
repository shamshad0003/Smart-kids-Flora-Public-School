'use client';

import { useState } from 'react';
import { Plus, Trash2, FileText, ExternalLink } from 'lucide-react';
import DownloadForm from './forms/DownloadForm';
import { deleteDownload } from '@/app/actions/downloads';

interface DownloadFile {
  id: string;
  title: string;
  category: string;
  fileUrl: string;
  createdAt: Date;
}

export default function DownloadManager({ initialData }: { initialData: DownloadFile[] }) {
  const [showForm, setShowForm] = useState(false);

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to remove this file link?')) {
      await deleteDownload(id);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Downloads</h2>
          <p className="text-gray-500 text-sm mt-1">Manage downloadable resources like syllabus and forms.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5 mr-1" />
          Add Resource
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <DownloadForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {initialData.length === 0 ? (
              <tr>
                 <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No downloadable files found.</td>
              </tr>
            ) : (
              initialData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-indigo-500 mr-3 shrink-0" />
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a 
                      href={item.fileUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-gray-400 hover:text-indigo-600 mr-4 inline-flex items-center transition"
                      title="Test Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900 transition"
                      title="Delete Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
