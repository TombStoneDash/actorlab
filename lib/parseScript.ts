import { Scene } from './sceneExamples';

export type ParsedLine = {
  speaker: string;
  text: string;
};

export type ScriptAnnotation = {
  lineIndex: number;
  note: string;
  type: 'actor' | 'coach' | 'beat';
  timestamp: number;
};

/**
 * Parse script text into structured dialogue lines
 * Supports formats:
 * - "CHARACTER: line"
 * - "CHARACTER - line"
 * - "CHARACTER. line"
 * - Alternating lines (auto-assign A/B)
 */
export function parseScript(text: string): ParsedLine[] {
  const lines = text
    .split(/\n+/)
    .map(l => l.trim())
    .filter(Boolean);

  const parsedLines: ParsedLine[] = [];

  // Try format with character prefix (CHARACTER: line)
  const formatRegex = /^([A-Z][A-Z0-9_\s]{1,30})[:\-\.]+\s*(.+)$/i;

  for (const line of lines) {
    const match = formatRegex.exec(line);
    if (match && match[2].trim().length > 0) {
      parsedLines.push({
        speaker: match[1].trim(),
        text: match[2].trim()
      });
    }
  }

  // If we got good results, return them
  if (parsedLines.length > 2) {
    return parsedLines;
  }

  // Fallback: alternating lines (A/B pattern)
  const fallbackLines: ParsedLine[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length > 0) {
      fallbackLines.push({
        speaker: i % 2 === 0 ? 'Character A' : 'Character B',
        text: lines[i]
      });
    }
  }

  return fallbackLines.length > 0 ? fallbackLines : parsedLines;
}

/**
 * Extract character names from parsed lines
 */
export function extractCharacters(lines: ParsedLine[]): string[] {
  const speakers = new Set(lines.map(l => l.speaker));
  return Array.from(speakers);
}

/**
 * Convert parsed lines into a Scene object
 */
export function createSceneFromParsed(
  lines: ParsedLine[],
  title: string = 'Custom Scene',
  description: string = 'Imported script'
): Scene {
  const speakers = extractCharacters(lines);

  return {
    id: `custom-${Date.now()}`,
    title,
    genre: 'Custom',
    roles: [speakers[0] || 'Character A', speakers[1] || 'Character B'] as [string, string],
    description,
    lines: lines.map(l => ({ speaker: l.speaker, text: l.text })),
    beats: []
  };
}

/**
 * Search lines by keyword
 */
export function searchLines(lines: ParsedLine[], query: string): number[] {
  const lowerQuery = query.toLowerCase();
  const matches: number[] = [];

  lines.forEach((line, idx) => {
    if (
      line.text.toLowerCase().includes(lowerQuery) ||
      line.speaker.toLowerCase().includes(lowerQuery)
    ) {
      matches.push(idx);
    }
  });

  return matches;
}

/**
 * Split scene into smaller chunks (by line count or time estimate)
 */
export function splitSceneByBeats(
  lines: ParsedLine[],
  linesPerBeat: number = 10
): ParsedLine[][] {
  const beats: ParsedLine[][] = [];

  for (let i = 0; i < lines.length; i += linesPerBeat) {
    beats.push(lines.slice(i, i + linesPerBeat));
  }

  return beats;
}

/**
 * Export scene as formatted text
 */
export function exportSceneAsText(scene: Scene): string {
  let output = `# ${scene.title}\n`;
  output += `Genre: ${scene.genre}\n`;
  output += `Characters: ${scene.roles.join(', ')}\n\n`;

  if (scene.description) {
    output += `${scene.description}\n\n`;
  }

  output += '---\n\n';

  scene.lines.forEach(line => {
    output += `${line.speaker}: ${line.text}\n\n`;
  });

  if (scene.beats && scene.beats.length > 0) {
    output += '\n---\n\n';
    output += `Beats: ${scene.beats.join(', ')}\n`;
  }

  return output;
}

/**
 * Count estimated reading time (rough approximation)
 */
export function estimateReadingTime(lines: ParsedLine[]): number {
  // Average speaking rate: ~150 words per minute
  const totalWords = lines.reduce((sum, line) => {
    return sum + line.text.split(/\s+/).length;
  }, 0);

  return Math.ceil(totalWords / 150); // minutes
}

/**
 * Parse file content based on type
 */
export async function parseFile(file: File): Promise<string> {
  const fileType = file.type;

  if (fileType === 'text/plain' || file.name.endsWith('.txt')) {
    return await file.text();
  }

  if (fileType === 'application/pdf' || file.name.endsWith('.pdf')) {
    // For now, return error - PDF parsing requires pdf.js library
    throw new Error('PDF parsing not yet implemented. Please copy and paste text instead.');
  }

  // Default: try to read as text
  return await file.text();
}
