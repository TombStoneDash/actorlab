'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Send, Loader2 } from 'lucide-react';

export default function SmartContact() {
  const [recipientName, setRecipientName] = useState('');
  const [recipientRole, setRecipientRole] = useState('');
  const [purpose, setPurpose] = useState('');
  const [context, setContext] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!recipientName.trim() || !purpose.trim()) {
      alert('Please provide recipient name and message purpose');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/smart-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientName, recipientRole, purpose, context }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(data.content);
      } else {
        alert('Error: ' + (data.error || 'Failed to generate message'));
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
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

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-pink-50 p-6 rounded-xl mb-8 border border-pink-200">
          <div className="flex items-center mb-4">
            <Mail className="w-8 h-8 text-pink-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Smart Contact</h1>
          </div>
          <p className="text-gray-700">
            Generate professional networking and follow-up messages for casting directors, agents, and industry contacts.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Recipient Name
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g., Sarah Johnson"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Recipient Role
              </label>
              <input
                type="text"
                value={recipientRole}
                onChange={(e) => setRecipientRole(e.target.value)}
                placeholder="e.g., Casting Director, Talent Agent, Producer"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message Purpose
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g., Following up after audition, Introducing myself, Thank you note"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Context (Optional)
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Add any relevant details: project name, audition date, previous interactions, etc."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-pink-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Message...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Generate Message</span>
                </>
              )}
            </button>
          </div>

          {message && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Professional Message</h2>
              <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap">
                {message}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(message)}
                className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all text-sm"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
