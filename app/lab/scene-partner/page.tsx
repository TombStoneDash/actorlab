'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, RotateCcw, Mic, Volume2, Repeat, ChevronDown, ChevronUp } from 'lucide-react';
import { BUILT_IN_SCENES, Scene, getAllGenres } from '@/lib/sceneExamples';

type VoiceStatus = 'idle' | 'speaking' | 'listening';

export default function ScenePartnerProPage() {
  // Scene selection state
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [userRole, setUserRole] = useState<0 | 1>(0); // 0 = roles[0], 1 = roles[1]
  const [isPlaying, setIsPlaying] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>('');

  // Voice state
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        setVoicesLoaded(voices.length > 0);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
          if (transcript.includes('line')) {
            giveLineHint();
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setVoiceStatus('idle');
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const genres = getAllGenres();
  const filteredScenes = selectedGenre
    ? BUILT_IN_SCENES.filter(scene => scene.genre === selectedGenre)
    : BUILT_IN_SCENES;

  const loadScene = (scene: Scene) => {
    setSelectedScene(scene);
    setCurrentLineIndex(0);
    setIsPlaying(false);
    setUserRole(0);
  };

  const currentLine = selectedScene?.lines[currentLineIndex];
  const isUserLine = currentLine?.speaker === selectedScene?.roles[userRole];
  const isPartnerLine = !isUserLine;

  const speakLine = (text: string) => {
    if (!synthRef.current || !voicesLoaded) return;

    synthRef.current.cancel(); // Stop any current speech

    const utterance = new SpeechSynthesisUtterance(text);

    // Try to find a good voice (prefer Samantha, Daniel, or Karen for natural delivery)
    const preferredVoices = availableVoices.filter(v =>
      v.name.includes('Samantha') ||
      v.name.includes('Daniel') ||
      v.name.includes('Karen') ||
      v.name.includes('Google')
    );

    if (preferredVoices.length > 0) {
      utterance.voice = preferredVoices[0];
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setVoiceStatus('speaking');
    utterance.onend = () => setVoiceStatus('idle');
    utterance.onerror = () => setVoiceStatus('idle');

    synthRef.current.speak(utterance);
  };

  const handleNext = () => {
    if (!selectedScene) return;

    // If on a partner line, speak it
    if (isPartnerLine && currentLine) {
      speakLine(currentLine.text);
    }

    // Move to next line
    if (currentLineIndex < selectedScene.lines.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1);
    } else {
      // Scene complete
      setIsPlaying(false);
    }
  };

  const giveLineHint = () => {
    if (!selectedScene || !isUserLine || !currentLine) return;

    // Give first 3-5 words as hint
    const words = currentLine.text.split(' ');
    const hint = words.slice(0, Math.min(5, words.length)).join(' ') + '...';
    speakLine(hint);
  };

  const swapRoles = () => {
    setUserRole(userRole === 0 ? 1 : 0);
    setCurrentLineIndex(0);
    setIsPlaying(false);
  };

  const restart = () => {
    setCurrentLineIndex(0);
    setIsPlaying(false);
    synthRef.current?.cancel();
    setVoiceStatus('idle');
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (voiceStatus === 'listening') {
      recognitionRef.current.stop();
      setVoiceStatus('idle');
    } else {
      recognitionRef.current.start();
      setVoiceStatus('listening');
    }
  };

  const startScene = () => {
    setIsPlaying(true);
    setCurrentLineIndex(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/lab" className="flex items-center text-purple-600 hover:text-purple-800 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Tools
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Volume2 className="w-8 h-8 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Scene Partner Pro
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real rehearsal partner with voice. Choose a scene, pick your role, and practice with spoken dialogue.
          </p>
          <p className="text-sm text-purple-600 mt-2">
            ✨ Offline-first • No API needed • Instant playback
          </p>
        </div>

        {!selectedScene ? (
          <div className="max-w-6xl mx-auto">
            {/* Genre Filter */}
            <div className="mb-8 flex justify-center">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-6 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium"
              >
                <option value="">All Genres ({BUILT_IN_SCENES.length})</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre} ({BUILT_IN_SCENES.filter(s => s.genre === genre).length})
                  </option>
                ))}
              </select>
            </div>

            {/* Scene Library */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScenes.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => loadScene(scene)}
                  className="group bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 text-left border-2 border-transparent hover:border-purple-400 hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-bold">
                      {scene.genre}
                    </span>
                    <Play className="w-5 h-5 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {scene.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{scene.description}</p>
                  <div className="border-t pt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-purple-600">{scene.roles[0]}</span>
                      <span className="text-gray-400">vs</span>
                      <span className="font-semibold text-pink-600">{scene.roles[1]}</span>
                    </div>
                    <p className="text-xs text-gray-500">{scene.lines.length} lines</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            {/* Scene Header */}
            <div className="bg-white rounded-t-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedScene.title}</h2>
                    <p className="text-sm opacity-90">{selectedScene.description}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                      {selectedScene.genre}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedScene(null);
                      setIsPlaying(false);
                      restart();
                    }}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    ← Change Scene
                  </button>
                </div>

                {/* Role Selection */}
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <span className="text-sm font-medium opacity-90">You're playing:</span>
                  <div className="flex gap-2">
                    {selectedScene.roles.map((role, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setUserRole(idx as 0 | 1);
                          restart();
                        }}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          userRole === idx
                            ? 'bg-white text-purple-600'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={swapRoles}
                    className="ml-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                  >
                    <Repeat className="w-4 h-4" />
                    Swap Roles
                  </button>
                </div>
              </div>

              {/* Current Line Display */}
              <div className="bg-gradient-to-b from-purple-50 to-white p-8 border-b">
                {!isPlaying ? (
                  <div className="text-center">
                    <button
                      onClick={startScene}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                    >
                      <Play className="w-6 h-6" />
                      Start Scene
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Status Indicator */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600">
                          Line {currentLineIndex + 1} of {selectedScene.lines.length}
                        </span>
                        {voiceStatus === 'speaking' && (
                          <span className="flex items-center gap-2 text-purple-600 text-sm font-medium">
                            <Volume2 className="w-4 h-4 animate-pulse" />
                            Speaking...
                          </span>
                        )}
                        {voiceStatus === 'listening' && (
                          <span className="flex items-center gap-2 text-pink-600 text-sm font-medium">
                            <Mic className="w-4 h-4 animate-pulse" />
                            Listening...
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={restart}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Restart
                        </button>
                      </div>
                    </div>

                    {/* Current Line Card */}
                    {currentLine && (
                      <div
                        className={`p-6 rounded-xl shadow-md ${
                          isUserLine
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-white border-2 border-purple-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold opacity-90">
                            {currentLine.speaker} {isUserLine ? '(YOU)' : '(PARTNER)'}
                          </span>
                          {isUserLine && (
                            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                              Your line
                            </span>
                          )}
                        </div>
                        <p className="text-lg leading-relaxed font-medium">{currentLine.text}</p>
                      </div>
                    )}

                    {/* Control Buttons */}
                    <div className="flex gap-3 justify-center mt-6">
                      {isUserLine ? (
                        <>
                          <button
                            onClick={giveLineHint}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                          >
                            <Volume2 className="w-5 h-5" />
                            LINE (hint)
                          </button>
                          <button
                            onClick={toggleListening}
                            className={`px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 ${
                              voiceStatus === 'listening'
                                ? 'bg-pink-600 hover:bg-pink-700 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                          >
                            <Mic className="w-5 h-5" />
                            {voiceStatus === 'listening' ? 'Stop Voice' : 'Voice Command'}
                          </button>
                          <button
                            onClick={handleNext}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                          >
                            Next
                            <Play className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleNext}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
                        >
                          <Volume2 className="w-6 h-6" />
                          Speak Partner Line & Continue
                        </button>
                      )}
                    </div>

                    {/* Scene Complete */}
                    {currentLineIndex >= selectedScene.lines.length - 1 && (
                      <div className="mt-6 p-6 bg-green-50 border-2 border-green-300 rounded-xl text-center">
                        <p className="text-lg font-bold text-green-800 mb-2">🎭 Scene Complete!</p>
                        <p className="text-sm text-green-700">Great work. Ready to run it again?</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Full Script View (Collapsible) */}
              <div className="bg-white">
                <button
                  onClick={() => setShowScript(!showScript)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b"
                >
                  <span className="font-semibold text-gray-700">Full Script</span>
                  {showScript ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {showScript && (
                  <div className="p-6 bg-gray-50 max-h-96 overflow-y-auto">
                    {selectedScene.lines.map((line, idx) => (
                      <div
                        key={idx}
                        className={`mb-4 p-4 rounded-lg ${
                          idx === currentLineIndex && isPlaying
                            ? 'bg-purple-100 border-2 border-purple-400'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p className="text-xs font-bold text-purple-600 mb-1">
                          {line.speaker}
                          {line.speaker === selectedScene.roles[userRole] && ' (YOU)'}
                        </p>
                        <p className="text-sm text-gray-800">{line.text}</p>
                      </div>
                    ))}

                    {selectedScene.beats && selectedScene.beats.length > 0 && (
                      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-xs font-bold text-purple-700 mb-2">EMOTIONAL BEATS</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedScene.beats.map((beat, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                            >
                              {beat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Browser Support Warning */}
            {!voicesLoaded && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Voice synthesis not available. Make sure you're using Chrome, Safari, or Edge.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
