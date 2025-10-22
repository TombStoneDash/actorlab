'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Video, Send, Loader2 } from 'lucide-react';

export default function DemoReelAnalyzer() {
  const [reelUrl, setReelUrl] = useState('');
  const [description, setDescription] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!reelUrl.trim() && !description.trim()) {
      alert('Please provide a reel URL or description');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/analyze-demo-reel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reelUrl, description }),
      });

      const data = await response.json();
      if (data.success) {
        setAnalysis(data.content);
      } else {
        alert('Error: ' + (data.error || 'Failed to analyze reel'));
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
        <div className="bg-red-50 p-6 rounded-xl mb-8 border border-red-200">
          <div className="flex items-center mb-4">
            <Video className="w-8 h-8 text-red-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Demo Reel Analyzer</h1>
          </div>
          <p className="text-gray-700">
            Get AI-powered feedback on your demo reel. Paste your reel URL or describe your performance.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Demo Reel URL (YouTube, Vimeo, etc.)
              </label>
              <input
                type="url"
                value={reelUrl}
                onChange={(e) => setReelUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Describe Your Reel (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the scenes, genres, and performances included in your reel..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-red-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Analyze Reel</span>
                </>
              )}
            </button>
          </div>

          {analysis && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">AI Analysis</h2>
              <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap">
                {analysis}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
