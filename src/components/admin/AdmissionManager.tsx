'use client';

import { Trash2, Mail, Phone, Eye } from 'lucide-react';
import { deleteAdmission, updateAdmissionStatus } from '@/app/actions/admissions';

interface Admission {
  id: string;
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  grade: string;
  message: string | null;
  status: string;
  createdAt: Date;
}

export default function AdmissionManager({ initialData }: { initialData: Admission[] }) {
  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this admission record?')) {
      await deleteAdmission(id);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    await updateAdmissionStatus(id, newStatus);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admissions</h2>
          <p className="text-gray-500 text-sm mt-1">Review and manage student admission applications.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {initialData.length === 0 ? (
                <tr>
                   <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No admission records found.</td>
                </tr>
              ) : (
                initialData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{item.studentName}</div>
                      <div className="text-xs text-gray-500">Parent: {item.parentName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded bg-purple-100 text-purple-800">
                        {item.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <a href={`mailto:${item.email}`} className="flex items-center text-xs text-blue-600 hover:underline">
                          <Mail className="w-3 h-3 mr-1" />
                          {item.email}
                        </a>
                        <a href={`tel:${item.phone}`} className="flex items-center text-xs text-blue-600 hover:underline">
                          <Phone className="w-3 h-3 mr-1" />
                          {item.phone}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <select 
                        value={item.status} 
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 focus:outline-none appearance-none text-center
                          ${item.status === 'APPROVED' ? 'bg-green-100 text-green-800 focus:ring-green-500' : ''}
                          ${item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 focus:ring-yellow-500' : ''}
                          ${item.status === 'REJECTED' ? 'bg-red-100 text-red-800 focus:ring-red-500' : ''}
                        `}
                      >
                        <option value="PENDING" className="bg-white text-gray-900">PENDING</option>
                        <option value="APPROVED" className="bg-white text-gray-900">APPROVED</option>
                        <option value="REJECTED" className="bg-white text-gray-900">REJECTED</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {item.message && (
                        <button 
                          className="text-gray-400 hover:text-blue-600 mr-3" 
                          title={`Message: ${item.message}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Record"
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
    </div>
  );
}
