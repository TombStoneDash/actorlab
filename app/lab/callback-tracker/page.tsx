'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Plus, Edit2, Trash2 } from 'lucide-react';

interface Audition {
  id: string;
  project: string;
  role: string;
  date: string;
  status: 'audition' | 'callback' | 'booked' | 'rejected';
  notes: string;
}

export default function CallbackTracker() {
  const [auditions, setAuditions] = useState<Audition[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    project: '',
    role: '',
    date: '',
    status: 'audition' as Audition['status'],
    notes: '',
  });

  const handleAdd = () => {
    if (!formData.project || !formData.role || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    const newAudition: Audition = {
      id: Date.now().toString(),
      ...formData,
    };

    setAuditions([newAudition, ...auditions]);
    setFormData({ project: '', role: '', date: '', status: 'audition', notes: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setAuditions(auditions.filter((a) => a.id !== id));
  };

  const getStatusColor = (status: Audition['status']) => {
    switch (status) {
      case 'audition':
        return 'bg-blue-100 text-blue-800';
      case 'callback':
        return 'bg-yellow-100 text-yellow-800';
      case 'booked':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
    }
  };

  const stats = {
    total: auditions.length,
    callbacks: auditions.filter((a) => a.status === 'callback').length,
    booked: auditions.filter((a) => a.status === 'booked').length,
    callbackRate: auditions.length > 0 ? ((auditions.filter((a) => a.status === 'callback' || a.status === 'booked').length / auditions.length) * 100).toFixed(1) : 0,
    bookingRate: auditions.length > 0 ? ((auditions.filter((a) => a.status === 'booked').length / auditions.length) * 100).toFixed(1) : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <Link href="/lab" className="text-2xl font-bold text-purple-900">
              🎭 Actor Lab
            </Link>
            <Link href="/lab" className="text-purple-600 hover:text-purple-800 font-medium">
              ← Back to Tools
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-yellow-50 p-6 rounded-xl mb-8 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <Calendar className="w-8 h-8 text-yellow-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">Callback Tracker</h1>
              </div>
              <p className="text-gray-700">Track your auditions, callbacks, and booking rates.</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-all flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Audition</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Total Auditions</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Callbacks</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.callbacks}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Booked</div>
            <div className="text-2xl font-bold text-green-600">{stats.booked}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Callback Rate</div>
            <div className="text-2xl font-bold text-purple-600">{stats.callbackRate}%</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Booking Rate</div>
            <div className="text-2xl font-bold text-indigo-600">{stats.bookingRate}%</div>
          </div>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-xl font-bold mb-6">Add New Audition</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                placeholder="Project Name"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Role"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Audition['status'] })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="audition">Audition</option>
                <option value="callback">Callback</option>
                <option value="booked">Booked</option>
                <option value="rejected">Rejected</option>
              </select>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notes (optional)"
                className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                rows={3}
              />
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleAdd}
                className="flex-1 bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition-all"
              >
                Add Audition
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Auditions List */}
        <div className="space-y-4">
          {auditions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No auditions tracked yet. Click "Add Audition" to get started!</p>
            </div>
          ) : (
            auditions.map((audition) => (
              <div key={audition.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{audition.project}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(audition.status)}`}>
                        {audition.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-gray-700 mb-1">
                      <span className="font-semibold">Role:</span> {audition.role}
                    </div>
                    <div className="text-gray-600 mb-2">
                      <span className="font-semibold">Date:</span> {new Date(audition.date).toLocaleDateString()}
                    </div>
                    {audition.notes && (
                      <div className="text-gray-600 text-sm">
                        <span className="font-semibold">Notes:</span> {audition.notes}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(audition.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
