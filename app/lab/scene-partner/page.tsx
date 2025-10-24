'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, RotateCcw, Mic, Volume2, Repeat, ChevronDown, ChevronUp, Settings, Lightbulb, Upload, MicOff, Download, FileText, Wrench } from 'lucide-react';
import { BUILT_IN_SCENES, Scene, getAllGenres } from '@/lib/sceneExamples';
import { parseScript, parseFile, createSceneFromParsed, ScriptAnnotation } from '@/lib/parseScript';
import ScriptToolsPanel from '@/components/lab/ScriptToolsPanel';

type VoiceStatus = 'idle' | 'speaking' | 'listening' | 'recording';

type SessionState = {
  sceneId: string;
  userRole: 0 | 1;
  currentLineIndex: number;
  voiceName: string | null;
  rate: number;
  volume: number;
};

type CoachNote = {
  text: string;
  timestamp: number;
};

export default function ScenePartnerProPage() {
  const router = useRouter();

  // Scene selection state
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [userRole, setUserRole] = useState<0 | 1>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedBeat, setSelectedBeat] = useState<string>('');

  // Voice state
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState<string | null>(null);
  const [rate, setRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);

  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showResumeToast, setShowResumeToast] = useState(false);
  const [importText, setImportText] = useState('');
  const [coachNote, setCoachNote] = useState<string | null>(null);
  const [loadingCoach, setLoadingCoach] = useState(false);
  const [showScriptTools, setShowScriptTools] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  // v3 features
  const [customScenes, setCustomScenes] = useState<Scene[]>([]);
  const [annotations, setAnnotations] = useState<ScriptAnnotation[]>([]);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key.toLowerCase() === 'n' && isPlaying) handleNext();
      if (e.key.toLowerCase() === 'l' && isPlaying) giveLineHint();
      if (e.key.toLowerCase() === 's' && selectedScene) swapRoles();
      if (e.key.toLowerCase() === 'r' && selectedScene) restart();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, selectedScene, currentLineIndex]);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('sp:settings') || '{}');
      setVoiceName(saved.voiceName ?? null);
      setRate(saved.rate ?? 1.0);
      setVolume(saved.volume ?? 1.0);
      setSelectedGenre(saved.genre ?? '');
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sp:settings', JSON.stringify({
        voiceName,
        rate,
        volume,
        genre: selectedGenre
      }));
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  }, [voiceName, rate, volume, selectedGenre]);

  // Load session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sp:session');
      if (saved) {
        const session: SessionState = JSON.parse(saved);
        const scene = BUILT_IN_SCENES.find(s => s.id === session.sceneId);
        if (scene) {
          setShowResumeToast(true);
          // Auto-restore after 2 seconds if user doesn't dismiss
          setTimeout(() => {
            if (showResumeToast) {
              resumeSession(session, scene);
            }
          }, 5000);
        }
      }
    } catch (err) {
      console.error('Failed to load session:', err);
    }
  }, []);

  // Save session to localStorage
  useEffect(() => {
    if (selectedScene && isPlaying) {
      try {
        const session: SessionState = {
          sceneId: selectedScene.id,
          userRole,
          currentLineIndex,
          voiceName,
          rate,
          volume
        };
        localStorage.setItem('sp:session', JSON.stringify(session));
      } catch (err) {
        console.error('Failed to save session:', err);
      }
    }
  }, [selectedScene, userRole, currentLineIndex, voiceName, rate, volume, isPlaying]);

  const resumeSession = (session: SessionState, scene: Scene) => {
    setSelectedScene(scene);
    setUserRole(session.userRole);
    setCurrentLineIndex(session.currentLineIndex);
    setIsPlaying(true);
    setShowResumeToast(false);
  };

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
          if (event.error === 'not-allowed') {
            alert('Microphone permission denied. Please enable microphone access in your browser settings.');
          }
          setVoiceStatus('idle');
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          // Ignore if already stopped
        }
      }
    };
  }, []);

  const genres = getAllGenres();

  // Get all unique beats from all scenes
  const allBeats = Array.from(new Set(
    BUILT_IN_SCENES.flatMap(scene => scene.beats || [])
  ));

  const filteredScenes = BUILT_IN_SCENES.filter(scene => {
    const matchesGenre = !selectedGenre || scene.genre === selectedGenre;
    const matchesBeat = !selectedBeat || (scene.beats && scene.beats.includes(selectedBeat));
    return matchesGenre && matchesBeat;
  });

  const loadScene = (scene: Scene) => {
    setSelectedScene(scene);
    setCurrentLineIndex(0);
    setIsPlaying(false);
    setUserRole(0);
    setCoachNote(null);
  };

  const currentLine = selectedScene?.lines[currentLineIndex];
  const isUserLine = currentLine?.speaker === selectedScene?.roles[userRole];
  const isPartnerLine = !isUserLine;

  const speakLine = useCallback((text: string) => {
    if (!synthRef.current || !voicesLoaded) return;

    synthRef.current.cancel(); // Stop any current speech

    const utterance = new SpeechSynthesisUtterance(text);

    // Use selected voice or fallback to preferred voices
    if (voiceName) {
      const selectedVoice = availableVoices.find(v => v.name === voiceName);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    } else {
      const preferredVoices = availableVoices.filter(v =>
        v.name.includes('Samantha') ||
        v.name.includes('Daniel') ||
        v.name.includes('Karen') ||
        v.name.includes('Google')
      );
      if (preferredVoices.length > 0) {
        utterance.voice = preferredVoices[0];
      }
    }

    utterance.rate = rate;
    utterance.volume = volume;

    utterance.onstart = () => setVoiceStatus('speaking');
    utterance.onend = () => setVoiceStatus('idle');
    utterance.onerror = () => setVoiceStatus('idle');

    synthRef.current.speak(utterance);
  }, [voicesLoaded, voiceName, rate, volume, availableVoices]);

  const handleNext = () => {
    if (!selectedScene) return;

    // If on a partner line, speak it
    if (isPartnerLine && currentLine) {
      speakLine(currentLine.text);
    }

    // Move to next line
    if (currentLineIndex < selectedScene.lines.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1);
      setCoachNote(null); // Clear coach note when moving
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
    setCoachNote(null);
  };

  const restart = () => {
    setCurrentLineIndex(0);
    setIsPlaying(false);
    synthRef.current?.cancel();
    setVoiceStatus('idle');
    setCoachNote(null);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (voiceStatus === 'listening') {
      recognitionRef.current.stop();
      setVoiceStatus('idle');
    } else {
      try {
        recognitionRef.current.start();
        setVoiceStatus('listening');
      } catch (err) {
        console.error('Failed to start recognition:', err);
      }
    }
  };

  const startScene = () => {
    setIsPlaying(true);
    setCurrentLineIndex(0);
  };

  // Coach Me feature
  const getCoachNote = async () => {
    if (!selectedScene || !currentLine) return;

    const key = `coach:${selectedScene.id}:${currentLineIndex}`;
    const cached = sessionStorage.getItem(key);

    if (cached) {
      setCoachNote(cached);
      return;
    }

    setLoadingCoach(true);
    try {
      const beat = selectedScene.beats?.[0] || 'dramatic';
      const lastLine = currentLineIndex > 0 ? selectedScene.lines[currentLineIndex - 1].text : '';

      const response = await fetch('/api/beat-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ beat, lastLine, currentLine: currentLine.text }),
      });

      const data = await response.json();
      if (data.success && data.note) {
        sessionStorage.setItem(key, data.note);
        setCoachNote(data.note);
      }
    } catch (err) {
      console.error('Failed to get coach note:', err);
    } finally {
      setLoadingCoach(false);
    }
  };

  // Recording feature
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        setRecordedChunks(chunks);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setVoiceStatus('recording');
    } catch (err) {
      console.error('Failed to start recording:', err);
      alert('Microphone access denied. Please enable microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setVoiceStatus('idle');
    }
  };

  const downloadRecording = () => {
    if (recordedUrl) {
      const a = document.createElement('a');
      a.href = recordedUrl;
      a.download = `scene-${selectedScene?.id || 'recording'}-${Date.now()}.webm`;
      a.click();
    }
  };

  // Load custom scenes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('scenePartner:customScenes');
      if (saved) {
        setCustomScenes(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to load custom scenes:', err);
    }
  }, []);

  // Save custom scenes to localStorage
  useEffect(() => {
    try {
      if (customScenes.length > 0) {
        localStorage.setItem('scenePartner:customScenes', JSON.stringify(customScenes));
      }
    } catch (err) {
      console.error('Failed to save custom scenes:', err);
    }
  }, [customScenes]);

  // Load annotations for current scene
  useEffect(() => {
    if (selectedScene) {
      try {
        const saved = localStorage.getItem(`sceneAnnotations:${selectedScene.id}`);
        if (saved) {
          setAnnotations(JSON.parse(saved));
        } else {
          setAnnotations([]);
        }
      } catch (err) {
        console.error('Failed to load annotations:', err);
      }
    }
  }, [selectedScene?.id]);

  // Save annotations
  useEffect(() => {
    if (selectedScene && annotations.length > 0) {
      try {
        localStorage.setItem(`sceneAnnotations:${selectedScene.id}`, JSON.stringify(annotations));
      } catch (err) {
        console.error('Failed to save annotations:', err);
      }
    }
  }, [annotations, selectedScene?.id]);

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await parseFile(file);
      setImportText(text);
      setImportFile(file);
    } catch (err: any) {
      alert(err.message || 'Failed to read file. Please try copy/paste instead.');
    }
  };

  // Script import parser (upgraded)
  const importScript = () => {
    if (!importText.trim()) return;

    const parsedLines = parseScript(importText);

    if (parsedLines.length > 0) {
      const fileName = importFile?.name.replace(/\.[^/.]+$/, '') || 'Custom Scene';
      const customScene = createSceneFromParsed(parsedLines, fileName, 'Imported script');

      // Add to custom scenes library
      setCustomScenes(prev => [...prev, customScene]);

      setSelectedScene(customScene);
      setShowImport(false);
      setImportText('');
      setImportFile(null);
      setCurrentLineIndex(0);
      setIsPlaying(false);
    } else {
      alert('Could not parse script. Please check the format and try again.');
    }
  };

  // Delete custom scene
  const deleteCustomScene = (sceneId: string) => {
    setCustomScenes(prev => prev.filter(s => s.id !== sceneId));
    localStorage.removeItem(`sceneAnnotations:${sceneId}`);
    if (selectedScene?.id === sceneId) {
      setSelectedScene(null);
    }
  };

  const hasSTT = typeof window !== 'undefined' &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

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

      {/* Resume Session Toast */}
      {showResumeToast && (
        <div className="fixed top-20 right-4 z-50 bg-purple-600 text-white p-4 rounded-lg shadow-xl max-w-sm">
          <p className="font-semibold mb-2">Resume previous session?</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const saved = localStorage.getItem('sp:session');
                if (saved) {
                  const session: SessionState = JSON.parse(saved);
                  const scene = BUILT_IN_SCENES.find(s => s.id === session.sceneId);
                  if (scene) resumeSession(session, scene);
                }
              }}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-50"
            >
              Resume
            </button>
            <button
              onClick={() => {
                setShowResumeToast(false);
                localStorage.removeItem('sp:session');
              }}
              className="bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-800"
            >
              Start Fresh
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Volume2 className="w-8 h-8 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Scene Partner Pro v3
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Creative script workspace with voice control, annotations, and AI coaching.
          </p>
          <p className="text-sm text-purple-600 mt-2">
            ✨ Upload scripts • Script tools • Scene library • Full annotations
          </p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-300 rounded-lg hover:bg-purple-50 transition-all"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={() => setShowImport(!showImport)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-300 rounded-lg hover:bg-purple-50 transition-all"
              aria-label="Import Script"
            >
              <Upload className="w-4 h-4" />
              Import Script
            </button>
            <button
              onClick={() => setShowLibrary(!showLibrary)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-300 rounded-lg hover:bg-purple-50 transition-all"
              aria-label="My Scenes"
            >
              <FileText className="w-4 h-4" />
              My Scenes ({customScenes.length})
            </button>
            {selectedScene && isPlaying && (
              <button
                onClick={() => setShowScriptTools(!showScriptTools)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                aria-label="Script Tools"
              >
                <Wrench className="w-4 h-4" />
                Script Tools
              </button>
            )}
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="max-w-4xl mx-auto mb-8 bg-white p-6 rounded-xl shadow-lg border-2 border-purple-200">
            <h3 className="text-xl font-bold mb-4">Voice & Audio Settings</h3>

            <div className="space-y-4">
              {/* Voice Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voice ({availableVoices.length} available)
                </label>
                <select
                  value={voiceName || ''}
                  onChange={(e) => setVoiceName(e.target.value || null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Default Voice</option>
                  {availableVoices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>

              {/* Rate Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speech Rate: {rate.toFixed(2)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5x (Slow)</span>
                  <span>1.0x (Normal)</span>
                  <span>2.0x (Fast)</span>
                </div>
              </div>

              {/* Volume Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume: {Math.round(volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Test Voice */}
              <button
                onClick={() => speakLine('This is how I will sound during the scene.')}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-all"
              >
                Test Voice
              </button>
            </div>
          </div>
        )}

        {/* Import Script Panel */}
        {showImport && (
          <div className="max-w-4xl mx-auto mb-8 bg-white p-6 rounded-xl shadow-lg border-2 border-purple-200">
            <h3 className="text-xl font-bold mb-4">Import Custom Script</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload a file or paste your script. Format: "CHARACTER: line" or alternating lines.
            </p>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Script File (.txt)
              </label>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              {importFile && (
                <p className="text-sm text-green-600 mt-2">
                  ✅ Loaded: {importFile.name}
                </p>
              )}
            </div>

            {/* Text Area */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Or Paste Script Text
              </label>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full h-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                placeholder="ALEX: I can't believe you did that.
JORDAN: I had no choice.
ALEX: There's always a choice."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={importScript}
                disabled={!importText.trim()}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
              >
                Import & Load Scene
              </button>
              <button
                onClick={() => {
                  setShowImport(false);
                  setImportText('');
                  setImportFile(null);
                }}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* My Scenes Library */}
        {showLibrary && (
          <div className="max-w-4xl mx-auto mb-8 bg-white p-6 rounded-xl shadow-lg border-2 border-purple-200">
            <h3 className="text-xl font-bold mb-4">My Custom Scenes</h3>
            {customScenes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No custom scenes yet. Import a script to get started!
              </p>
            ) : (
              <div className="space-y-3">
                {customScenes.map((scene) => (
                  <div
                    key={scene.id}
                    className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-all"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{scene.title}</h4>
                      <p className="text-sm text-gray-600">
                        {scene.lines.length} lines • {scene.roles.join(' vs ')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          loadScene(scene);
                          setShowLibrary(false);
                        }}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all text-sm font-semibold"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${scene.title}"?`)) {
                            deleteCustomScene(scene.id);
                          }
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all text-sm font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowLibrary(false)}
              className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-all"
            >
              Close
            </button>
          </div>
        )}

        {!selectedScene ? (
          <div className="max-w-6xl mx-auto">
            {/* Genre & Beat Filters */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center">
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

              <select
                value={selectedBeat}
                onChange={(e) => setSelectedBeat(e.target.value)}
                className="px-6 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium"
              >
                <option value="">All Beats</option>
                {allBeats.map(beat => (
                  <option key={beat} value={beat}>
                    {beat}
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
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-purple-600">{scene.roles[0]}</span>
                      <span className="text-gray-400">vs</span>
                      <span className="font-semibold text-pink-600">{scene.roles[1]}</span>
                    </div>
                    <p className="text-xs text-gray-500">{scene.lines.length} lines</p>
                    {scene.beats && scene.beats.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {scene.beats.slice(0, 3).map((beat, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded text-xs">
                            {beat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {filteredScenes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No scenes match your filters. Try adjusting them.</p>
              </div>
            )}
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
                      localStorage.removeItem('sp:session');
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
                        aria-label={`Play ${role}`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={swapRoles}
                    className="ml-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                    aria-label="Swap roles (S key)"
                  >
                    <Repeat className="w-4 h-4" />
                    Swap (S)
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
                      aria-label="Start scene"
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
                        <span className="text-sm font-medium text-gray-600" aria-live="polite">
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
                        {voiceStatus === 'recording' && (
                          <span className="flex items-center gap-2 text-red-600 text-sm font-medium">
                            <Mic className="w-4 h-4 animate-pulse" />
                            Recording...
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={restart}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                          aria-label="Restart scene (R key)"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Restart (R)
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
                        role="region"
                        aria-label={`Current line: ${currentLine.speaker}`}
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

                    {/* Coach Note */}
                    {coachNote && (
                      <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-yellow-800 mb-1">Coach's Note:</p>
                            <p className="text-sm text-yellow-900">{coachNote}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Control Buttons */}
                    <div className="flex flex-wrap gap-3 justify-center mt-6">
                      {isUserLine ? (
                        <>
                          <button
                            onClick={giveLineHint}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                            aria-label="LINE - Get first words hint (L key)"
                          >
                            <Volume2 className="w-5 h-5" />
                            LINE (L)
                          </button>
                          {hasSTT && (
                            <button
                              onClick={toggleListening}
                              className={`px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 ${
                                voiceStatus === 'listening'
                                  ? 'bg-pink-600 hover:bg-pink-700 text-white'
                                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                              }`}
                              aria-label="Toggle voice command listening"
                            >
                              <Mic className="w-5 h-5" />
                              {voiceStatus === 'listening' ? 'Stop Voice' : 'Voice Command'}
                            </button>
                          )}
                          <button
                            onClick={getCoachNote}
                            disabled={loadingCoach}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                            aria-label="Get coaching tip"
                          >
                            <Lightbulb className="w-5 h-5" />
                            {loadingCoach ? 'Thinking...' : 'Coach Me'}
                          </button>
                          <button
                            onClick={handleNext}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                            aria-label="Next line (N key)"
                          >
                            Next (N)
                            <Play className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleNext}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
                          aria-label="Speak partner line and continue (N key)"
                        >
                          <Volume2 className="w-6 h-6" />
                          Speak Partner Line & Continue (N)
                        </button>
                      )}
                    </div>

                    {/* Recording Controls */}
                    <div className="flex gap-3 justify-center mt-4">
                      {!isRecording ? (
                        <button
                          onClick={startRecording}
                          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                          aria-label="Start recording"
                        >
                          <Mic className="w-4 h-4" />
                          Record Take
                        </button>
                      ) : (
                        <button
                          onClick={stopRecording}
                          className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 animate-pulse"
                          aria-label="Stop recording"
                        >
                          <MicOff className="w-4 h-4" />
                          Stop Recording
                        </button>
                      )}

                      {recordedUrl && (
                        <>
                          <button
                            onClick={() => {
                              if (audioRef.current) {
                                audioRef.current.src = recordedUrl;
                                audioRef.current.play();
                              }
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                            aria-label="Play recording"
                          >
                            <Play className="w-4 h-4" />
                            Play Take
                          </button>
                          <button
                            onClick={downloadRecording}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                            aria-label="Download recording"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </>
                      )}
                    </div>
                    <audio ref={audioRef} className="hidden" />

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
                  aria-label={showScript ? 'Hide full script' : 'Show full script'}
                  aria-expanded={showScript}
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

            {/* Browser Support Warnings */}
            <div className="mt-4 space-y-2">
              {!voicesLoaded && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Voice synthesis not available. Make sure you're using Chrome, Safari, or Edge.
                  </p>
                </div>
              )}
              {!hasSTT && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    ℹ️ Voice command not supported in this browser. Use the LINE button instead.
                  </p>
                </div>
              )}
            </div>

            {/* Keyboard Shortcuts Help */}
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-xs font-semibold text-gray-700 mb-2">⌨️ Keyboard Shortcuts:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
                <div><kbd className="px-2 py-1 bg-white rounded border">N</kbd> Next</div>
                <div><kbd className="px-2 py-1 bg-white rounded border">L</kbd> LINE</div>
                <div><kbd className="px-2 py-1 bg-white rounded border">S</kbd> Swap Roles</div>
                <div><kbd className="px-2 py-1 bg-white rounded border">R</kbd> Restart</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Script Tools Panel */}
      {showScriptTools && selectedScene && (
        <ScriptToolsPanel
          scene={selectedScene}
          currentLineIndex={currentLineIndex}
          onJumpToLine={(index) => {
            setCurrentLineIndex(index);
            setShowScriptTools(false);
          }}
          onSplitScene={(linesPerBeat) => {
            alert(`Split scene into ${Math.ceil(selectedScene.lines.length / linesPerBeat)} beats with ${linesPerBeat} lines each.`);
            // Future: Actually implement scene splitting
          }}
          annotations={annotations}
          onAddAnnotation={(annotation) => {
            setAnnotations(prev => [...prev, annotation]);
          }}
          onClose={() => setShowScriptTools(false)}
        />
      )}
    </div>
  );
}
