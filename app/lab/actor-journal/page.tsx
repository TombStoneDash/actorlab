'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Plus, Trash2 } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
}

export default function ActorJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'neutral',
  });

  const handleAdd = () => {
    if (!formData.title || !formData.content) {
      alert('Please fill in title and content');
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...formData,
    };

    setEntries([newEntry, ...entries]);
    setFormData({ title: '', content: '', mood: 'neutral' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'excited':
        return '🤩';
      case 'happy':
        return '😊';
      case 'neutral':
        return '😐';
      case 'frustrated':
        return '😤';
      case 'sad':
        return '😔';
      default:
        return '😐';
    }
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

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-purple-50 p-6 rounded-xl mb-8 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <BookOpen className="w-8 h-8 text-purple-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">Actor Journal</h1>
              </div>
              <p className="text-gray-700">
                Document your acting journey, track progress, and reflect on your experiences.
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Entry</span>
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-xl font-bold mb-6">New Journal Entry</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Entry Title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <select
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="excited">🤩 Excited</option>
                <option value="happy">😊 Happy</option>
                <option value="neutral">😐 Neutral</option>
                <option value="frustrated">😤 Frustrated</option>
                <option value="sad">😔 Sad</option>
              </select>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write about your day, auditions, performances, learnings, or anything on your mind..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                rows={8}
              />
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleAdd}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-all font-semibold"
              >
                Save Entry
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Entries List */}
        <div className="space-y-6">
          {entries.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No journal entries yet. Click "New Entry" to start documenting your journey!</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{entry.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{entry.content}</div>
              </div>
            ))
          )}
        </div>

        {entries.length > 0 && (
          <div className="mt-8 bg-purple-50 p-6 rounded-lg border border-purple-200 text-center">
            <p className="text-gray-700">
              <span className="font-bold text-purple-900">{entries.length}</span> journal {entries.length === 1 ? 'entry' : 'entries'} documenting your acting journey 🎭
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
