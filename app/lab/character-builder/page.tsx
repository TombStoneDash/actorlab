'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Send, Loader2 } from 'lucide-react';

export default function CharacterBuilder() {
  const [characterName, setCharacterName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [characterInfo, setCharacterInfo] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBuild = async () => {
    if (!characterName.trim() || !characterInfo.trim()) {
      alert('Please provide character name and information');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/character-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterName, projectType, characterInfo }),
      });

      const data = await response.json();
      if (data.success) {
        setAnalysis(data.content);
      } else {
        alert('Error: ' + (data.error || 'Failed to build character'));
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
        <div className="bg-indigo-50 p-6 rounded-xl mb-8 border border-indigo-200">
          <div className="flex items-center mb-4">
            <User className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Character Builder</h1>
          </div>
          <p className="text-gray-700">
            Deep dive into character development with AI-powered analysis and backstory creation.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Character Name
              </label>
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="e.g., Hamlet, Regina George, Michael Scott"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Type
              </label>
              <input
                type="text"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                placeholder="e.g., Film, TV, Theater, Audition"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Character Information
              </label>
              <textarea
                value={characterInfo}
                onChange={(e) => setCharacterInfo(e.target.value)}
                placeholder="Describe the character's background, motivations, relationships, key scenes, and any other relevant information..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              onClick={handleBuild}
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Building Character...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Build Character</span>
                </>
              )}
            </button>
          </div>

          {analysis && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Character Analysis</h2>
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
