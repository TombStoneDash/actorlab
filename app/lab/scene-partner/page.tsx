'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';

type Message = {
  role: 'user' | 'partner';
  content: string;
  timestamp: string;
};

export default function ScenePartnerPage() {
  const [sceneSetup, setSceneSetup] = useState({
    script: '',
    characterName: 'You',
    partnerCharacter: 'Partner',
    context: '',
  });
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [loading, setLoading] = useState(false);

  const startScene = () => {
    if (sceneSetup.script || sceneSetup.context) {
      setStarted(true);
      setMessages([
        {
          role: 'partner',
          content: `Ready to practice! I'll play ${sceneSetup.partnerCharacter}. Start when you're ready.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const sendLine = async () => {
    if (!currentLine.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: currentLine,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentLine('');
    setLoading(true);

    try {
      const response = await fetch('/api/scene-partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: sceneSetup.script,
          characterName: sceneSetup.characterName,
          partnerCharacter: sceneSetup.partnerCharacter,
          context: sceneSetup.context,
          userLine: currentLine,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const partnerMessage: Message = {
          role: 'partner',
          content: data.response,
          timestamp: data.timestamp,
        };
        setMessages((prev) => [...prev, partnerMessage]);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetScene = () => {
    setStarted(false);
    setMessages([]);
    setCurrentLine('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/lab" className="flex items-center text-purple-600 hover:text-purple-800">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Tools
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Scene Partner</h1>
          <p className="text-lg text-gray-600">
            Practice your scenes with an AI partner that responds in character
          </p>
        </div>

        {!started ? (
          <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Set Up Your Scene</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Character Name
                </label>
                <input
                  type="text"
                  value={sceneSetup.characterName}
                  onChange={(e) =>
                    setSceneSetup({ ...sceneSetup, characterName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Romeo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partner Character Name
                </label>
                <input
                  type="text"
                  value={sceneSetup.partnerCharacter}
                  onChange={(e) =>
                    setSceneSetup({ ...sceneSetup, partnerCharacter: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Juliet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scene Context
                </label>
                <textarea
                  value={sceneSetup.context}
                  onChange={(e) => setSceneSetup({ ...sceneSetup, context: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="A romantic scene on a balcony..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Script Excerpt (Optional)
                </label>
                <textarea
                  value={sceneSetup.script}
                  onChange={(e) => setSceneSetup({ ...sceneSetup, script: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows={6}
                  placeholder="Paste your script here..."
                />
              </div>

              <button
                onClick={startScene}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700"
              >
                Start Scene Practice
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Practicing as</p>
                <p className="font-semibold">{sceneSetup.characterName}</p>
              </div>
              <button
                onClick={resetScene}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
              >
                New Scene
              </button>
            </div>

            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-xs opacity-75 mb-1">
                      {msg.role === 'user' ? sceneSetup.characterName : sceneSetup.partnerCharacter}
                    </p>
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-lg">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentLine}
                  onChange={(e) => setCurrentLine(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !loading && sendLine()}
                  placeholder="Type your line..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  disabled={loading}
                />
                <button
                  onClick={sendLine}
                  disabled={loading || !currentLine.trim()}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
