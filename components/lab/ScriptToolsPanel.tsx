'use client';

import { useState } from 'react';
import { Search, Scissors, Download, StickyNote, Sparkles, X } from 'lucide-react';
import { Scene } from '@/lib/sceneExamples';
import { searchLines, splitSceneByBeats, exportSceneAsText, estimateReadingTime, ScriptAnnotation } from '@/lib/parseScript';

type ScriptToolsPanelProps = {
  scene: Scene;
  currentLineIndex: number;
  onJumpToLine: (index: number) => void;
  onSplitScene: (beats: number) => void;
  annotations: ScriptAnnotation[];
  onAddAnnotation: (annotation: ScriptAnnotation) => void;
  onClose: () => void;
};

export default function ScriptToolsPanel({
  scene,
  currentLineIndex,
  onJumpToLine,
  onSplitScene,
  annotations,
  onAddAnnotation,
  onClose
}: ScriptToolsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [showAnnotation, setShowAnnotation] = useState(false);
  const [annotationText, setAnnotationText] = useState('');
  const [annotationType, setAnnotationType] = useState<'actor' | 'coach' | 'beat'>('actor');

  const handleSearch = () => {
    const results = searchLines(scene.lines, searchQuery);
    setSearchResults(results);
  };

  const handleExport = () => {
    const text = exportSceneAsText(scene);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scene.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddNote = () => {
    if (annotationText.trim()) {
      onAddAnnotation({
        lineIndex: currentLineIndex,
        note: annotationText,
        type: annotationType,
        timestamp: Date.now()
      });
      setAnnotationText('');
      setShowAnnotation(false);
    }
  };

  const readingTime = estimateReadingTime(scene.lines);

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex justify-between items-center sticky top-0">
        <h3 className="font-bold text-lg">Script Tools</h3>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1 rounded transition-colors"
          aria-label="Close script tools"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Scene Info */}
        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
          <p className="text-xs font-semibold text-purple-700 mb-1">Scene Info</p>
          <p className="text-sm text-gray-800">{scene.lines.length} lines</p>
          <p className="text-sm text-gray-800">~{readingTime} min read</p>
          <p className="text-sm text-gray-800">{annotations.length} notes</p>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Search className="w-4 h-4" />
            Search Lines
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search dialogue..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSearch}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
            >
              Go
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="bg-gray-50 p-2 rounded-lg max-h-40 overflow-y-auto">
              <p className="text-xs font-semibold text-gray-600 mb-2">
                {searchResults.length} result{searchResults.length !== 1 && 's'}
              </p>
              {searchResults.map((idx) => (
                <button
                  key={idx}
                  onClick={() => onJumpToLine(idx)}
                  className="w-full text-left p-2 hover:bg-purple-100 rounded text-sm mb-1 transition-colors"
                >
                  <span className="font-semibold text-purple-600">Line {idx + 1}:</span>{' '}
                  <span className="text-gray-700">
                    {scene.lines[idx].speaker} - {scene.lines[idx].text.substring(0, 40)}...
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Add Annotation */}
        <div className="space-y-2">
          <button
            onClick={() => setShowAnnotation(!showAnnotation)}
            className="w-full flex items-center gap-2 text-sm font-semibold text-gray-700 bg-yellow-50 hover:bg-yellow-100 p-3 rounded-lg border border-yellow-200 transition-all"
          >
            <StickyNote className="w-4 h-4" />
            Add Note to Current Line
          </button>

          {showAnnotation && (
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 space-y-2">
              <select
                value={annotationType}
                onChange={(e) => setAnnotationType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500"
              >
                <option value="actor">Actor Note</option>
                <option value="coach">Coach Note</option>
                <option value="beat">Beat/Intention</option>
              </select>
              <textarea
                value={annotationText}
                onChange={(e) => setAnnotationText(e.target.value)}
                placeholder="Add your note here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddNote}
                  disabled={!annotationText.trim()}
                  className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-semibold"
                >
                  Save Note
                </button>
                <button
                  onClick={() => {
                    setShowAnnotation(false);
                    setAnnotationText('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Annotations List */}
        {annotations.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <StickyNote className="w-4 h-4" />
              Your Notes ({annotations.length})
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {annotations.map((ann, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg border text-sm ${
                    ann.type === 'actor'
                      ? 'bg-blue-50 border-blue-200'
                      : ann.type === 'coach'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-purple-50 border-purple-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold text-gray-600">
                      Line {ann.lineIndex + 1} • {ann.type}
                    </span>
                    <button
                      onClick={() => onJumpToLine(ann.lineIndex)}
                      className="text-xs text-purple-600 hover:underline"
                    >
                      Jump
                    </button>
                  </div>
                  <p className="text-gray-700">{ann.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Split Scene */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Scissors className="w-4 h-4" />
            Split Scene
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onSplitScene(10)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm transition-all"
            >
              10 lines/beat
            </button>
            <button
              onClick={() => onSplitScene(15)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm transition-all"
            >
              15 lines/beat
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Splits scene into smaller practice chunks
          </p>
        </div>

        {/* Export */}
        <div className="space-y-2">
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold"
          >
            <Download className="w-4 h-4" />
            Export Script (.txt)
          </button>
        </div>

        {/* Scene Beats */}
        {scene.beats && scene.beats.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Emotional Beats
            </p>
            <div className="flex flex-wrap gap-2">
              {scene.beats.map((beat, idx) => (
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
    </div>
  );
}
