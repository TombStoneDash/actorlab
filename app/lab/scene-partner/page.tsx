'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Loader2, Sparkles, Play } from 'lucide-react';

type Message = {
  role: 'user' | 'partner';
  content: string;
  timestamp: string;
};

type SceneExample = {
  id: string;
  title: string;
  genre: string;
  description: string;
  yourCharacter: string;
  partnerCharacter: string;
  context: string;
  firstLine: string;
  emotionalTone: string;
};

const SCENE_EXAMPLES: SceneExample[] = [
  {
    id: 'medical-drama',
    title: 'Emergency Room Crisis',
    genre: 'Medical Drama',
    description: 'High-stakes medical drama inspired by The Pitt - intense ER scene',
    yourCharacter: 'Dr. Sarah Chen',
    partnerCharacter: 'Dr. Michael Ross',
    context: 'Trauma bay. Critical patient just arrived. Two doctors disagree on treatment. Lives are at stake.',
    firstLine: "We don't have time for this! Start the transfusion now or we lose him!",
    emotionalTone: 'Urgent, intense, professional under pressure'
  },
  {
    id: 'detective-interrogation',
    title: 'Police Interrogation',
    genre: 'Crime/Detective',
    description: 'Tense interrogation room scene - cat and mouse dialogue',
    yourCharacter: 'Detective Rivera',
    partnerCharacter: 'Marcus Webb (Suspect)',
    context: 'Interrogation room. Detective has evidence but needs a confession. Suspect is calculating and clever.',
    firstLine: "I know you were there that night, Marcus. Your car was on the traffic cam two blocks away.",
    emotionalTone: 'Controlled intensity, strategic, probing'
  },
  {
    id: 'romcom-confession',
    title: 'Coffee Shop Confession',
    genre: 'Romantic Comedy',
    description: 'Sweet, awkward romantic confession scene',
    yourCharacter: 'Jamie',
    partnerCharacter: 'Alex',
    context: 'Busy coffee shop. Best friends for years. Jamie is finally ready to confess feelings but keeps getting interrupted.',
    firstLine: "Okay, I need to tell you something and I need you to just... let me say it before I lose my nerve.",
    emotionalTone: 'Nervous, heartfelt, vulnerable with humor'
  },
  {
    id: 'dramatic-confrontation',
    title: 'Family Betrayal',
    genre: 'Dramatic Confrontation',
    description: 'Intense family drama - secrets revealed',
    yourCharacter: 'Jordan',
    partnerCharacter: 'Mom (Patricia)',
    context: 'Living room. Jordan just discovered their mother has been hiding a devastating secret for 20 years.',
    firstLine: "How could you keep this from me? Twenty years, Mom. TWENTY YEARS of lies!",
    emotionalTone: 'Raw emotion, betrayal, building anger and hurt'
  },
  {
    id: 'comedy-audition',
    title: 'The Awkward Date',
    genre: 'Comedy',
    description: 'Physical comedy audition piece - terrible first date',
    yourCharacter: 'Casey',
    partnerCharacter: 'Riley',
    context: 'Restaurant. Blind date is going horribly wrong. Everything that can go wrong, does.',
    firstLine: "So, uh... do you always order the lobster thermidor on first dates, or am I just special?",
    emotionalTone: 'Awkward, self-deprecating humor, growing panic'
  },
  {
    id: 'superhero-moment',
    title: 'Hero\'s Sacrifice',
    genre: 'Superhero/Action',
    description: 'Marvel-style dramatic scene - hero making impossible choice',
    yourCharacter: 'Phoenix (Hero)',
    partnerCharacter: 'Captain Strike',
    context: 'Crumbling building. Must choose between saving civilians or stopping the villain. Partner is injured.',
    firstLine: "You know I can\'t let them die. Get the civilians out. I\'m going after Vortex alone.",
    emotionalTone: 'Determined, heroic, underlying fear'
  },
  {
    id: 'kitchen-chaos',
    title: 'Kitchen Nightmare',
    genre: 'Restaurant Drama',
    description: 'The Bear-style intense kitchen scene during dinner rush',
    yourCharacter: 'Chef Alex',
    partnerCharacter: 'Sous Chef Marco',
    context: 'Professional kitchen. Dinner rush. Order is wrong. Critic is in the dining room. Pressure is mounting.',
    firstLine: "Behind! BEHIND! Marco, where are my scallops? Table six has been waiting twenty minutes!",
    emotionalTone: 'High-energy, stressed, professional intensity'
  },
  {
    id: 'sci-fi-discovery',
    title: 'The First Contact',
    genre: 'Sci-Fi',
    description: 'Scientists discover alien signal - wonder and fear',
    yourCharacter: 'Dr. Elena Rodriguez',
    partnerCharacter: 'Commander Hayes',
    context: 'Space station lab. First confirmed alien transmission detected. Team must decide how to respond.',
    firstLine: "It\'s not random noise. This is a pattern. An algorithm. Someone out there is trying to reach us.",
    emotionalTone: 'Awe, scientific curiosity, underlying tension'
  },
  {
    id: 'legal-drama',
    title: 'Courtroom Cross-Examination',
    genre: 'Legal Drama',
    description: 'Attorney breaks down a witness on the stand',
    yourCharacter: 'Attorney Morgan Blake',
    partnerCharacter: 'Witness (Dr. Thompson)',
    context: 'Courtroom. Defense attorney is cross-examining expert witness. One question away from breaking the case.',
    firstLine: "Dr. Thompson, you testified that you reviewed the evidence thoroughly. Define \'thoroughly\' for the jury.",
    emotionalTone: 'Sharp, controlled aggression, tactical'
  },
  {
    id: 'horror-tension',
    title: 'Don\'t Open That Door',
    genre: 'Horror/Thriller',
    description: 'Classic horror scene - characters hear something',
    yourCharacter: 'Sam',
    partnerCharacter: 'Morgan',
    context: 'Dark basement. Power is out. Strange noises coming from behind locked door. Phone has no signal.',
    firstLine: "Did you hear that? No, shut up and listen. There it is again... something\'s moving down there.",
    emotionalTone: 'Whispered tension, growing dread, controlled panic'
  },
  {
    id: 'period-drama',
    title: 'Regency Proposal',
    genre: 'Period Drama',
    description: 'Bridgerton-style marriage proposal gone wrong',
    yourCharacter: 'Lady Catherine Ashford',
    partnerCharacter: 'Lord Edmund Blackwood',
    context: 'Drawing room, 1815. Lord Blackwood has proposed but revealed it\'s for money, not love.',
    firstLine: "A marriage of convenience, my lord? How perfectly... mercenary of you. Did you rehearse this insult?",
    emotionalTone: 'Refined anger, wounded pride, sharp wit'
  },
  {
    id: 'sports-drama',
    title: 'Locker Room Speech',
    genre: 'Sports Drama',
    description: 'Coach and player - last game of the season',
    yourCharacter: 'Coach Rivera',
    partnerCharacter: 'Star Player Jackson',
    context: 'Locker room, halftime. Team is losing. Star player wants to quit. Championship on the line.',
    firstLine: "You walk out that door now, you\'re not just quitting on me. You\'re quitting on every kid who looks up to you.",
    emotionalTone: 'Passionate, motivational, tough love'
  },
  {
    id: 'musical-duet',
    title: 'The Audition Callback',
    genre: 'Musical Theatre',
    description: 'Two actors competing for the same role',
    yourCharacter: 'Riley Martinez',
    partnerCharacter: 'Jordan Chen',
    context: 'Theatre stage. Final callback. Both actors know only one will get the role. Friendship vs. ambition.',
    firstLine: "We both know you nailed that song. But this role... it\'s everything I\'ve worked for. I need this, Jordan.",
    emotionalTone: 'Vulnerable honesty, conflicted friendship, ambition'
  },
  {
    id: 'western-standoff',
    title: 'High Noon Confrontation',
    genre: 'Western',
    description: 'Classic western showdown with words before guns',
    yourCharacter: 'Sheriff Kate Morgan',
    partnerCharacter: 'Outlaw Jack "The Snake" Morrison',
    context: 'Dusty main street. High noon. Everyone has cleared out. Years of history between these two.',
    firstLine: "You had your chance to ride out of town, Jack. But you came back. You always come back.",
    emotionalTone: 'Steely resolve, old wounds, dangerous calm'
  },
  {
    id: 'workplace-comedy',
    title: 'The Promotion Meeting',
    genre: 'Workplace Comedy',
    description: 'Office politics meet absurd corporate culture',
    yourCharacter: 'Taylor Stevens',
    partnerCharacter: 'Boss (Linda Patterson)',
    context: 'Conference room. Performance review. Boss gives nonsensical corporate feedback. Dreams of promotion fading.',
    firstLine: "So when you say my \'synergy with the team\'s paradigm shift\' needs work... what does that actually mean?",
    emotionalTone: 'Confused, trying to remain professional, suppressed frustration'
  },
];

export default function ScenePartnerPage() {
  const [sceneSetup, setSceneSetup] = useState({
    script: '',
    characterName: '',
    partnerCharacter: '',
    context: '',
    genre: '',
  });
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [loading, setLoading] = useState(false);
  const [showExamples, setShowExamples] = useState(true);

  const loadExample = (example: SceneExample) => {
    setSceneSetup({
      script: '',
      characterName: example.yourCharacter,
      partnerCharacter: example.partnerCharacter,
      context: example.context,
      genre: example.genre,
    });
    setShowExamples(false);
  };

  const startScene = () => {
    if (sceneSetup.context) {
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
          characterName: sceneSetup.characterName,
          partnerCharacter: sceneSetup.partnerCharacter,
          context: sceneSetup.context,
          genre: sceneSetup.genre,
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
    setShowExamples(true);
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
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Scene Partner
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Practice scenes with an AI partner that responds instantly in character.
            Choose from popular examples or create your own custom scene.
          </p>
        </div>

        {!started ? (
          <div className="max-w-6xl mx-auto">
            {/* Scene Examples */}
            {showExamples && (
              <div className="mb-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Scene Examples</h2>
                  <p className="text-gray-600">Click any scene to load it instantly</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SCENE_EXAMPLES.map((example) => (
                    <button
                      key={example.id}
                      onClick={() => loadExample(example)}
                      className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-left border-2 border-transparent hover:border-purple-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                          {example.genre}
                        </span>
                        <Play className="w-5 h-5 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {example.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{example.description}</p>
                      <div className="text-xs text-gray-500">
                        <p><span className="font-semibold">You:</span> {example.yourCharacter}</p>
                        <p><span className="font-semibold">Partner:</span> {example.partnerCharacter}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowExamples(false)}
                    className="text-purple-600 hover:text-purple-800 font-semibold"
                  >
                    Or create your own custom scene →
                  </button>
                </div>
              </div>
            )}

            {/* Custom Scene Setup */}
            {!showExamples && (
              <div className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Set Up Your Scene</h2>
                  <button
                    onClick={() => setShowExamples(true)}
                    className="text-sm text-purple-600 hover:text-purple-800"
                  >
                    ← Browse Examples
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Character Name *
                      </label>
                      <input
                        type="text"
                        value={sceneSetup.characterName}
                        onChange={(e) => setSceneSetup({ ...sceneSetup, characterName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Detective Rivera"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Partner Character Name *
                      </label>
                      <input
                        type="text"
                        value={sceneSetup.partnerCharacter}
                        onChange={(e) => setSceneSetup({ ...sceneSetup, partnerCharacter: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Marcus Webb"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Genre
                    </label>
                    <select
                      value={sceneSetup.genre}
                      onChange={(e) => setSceneSetup({ ...sceneSetup, genre: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select genre...</option>
                      <option value="Drama">Drama</option>
                      <option value="Comedy">Comedy</option>
                      <option value="Action">Action</option>
                      <option value="Romance">Romance</option>
                      <option value="Thriller">Thriller</option>
                      <option value="Horror">Horror</option>
                      <option value="Sci-Fi">Sci-Fi</option>
                      <option value="Musical">Musical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scene Context *
                    </label>
                    <textarea
                      value={sceneSetup.context}
                      onChange={(e) => setSceneSetup({ ...sceneSetup, context: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={4}
                      placeholder="Describe the scene: Where are they? What's happening? What's the emotional tone?"
                    />
                  </div>

                  <button
                    onClick={startScene}
                    disabled={!sceneSetup.context || !sceneSetup.characterName || !sceneSetup.partnerCharacter}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    Start Scene Practice
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-90">Practicing as</p>
                  <p className="font-bold text-lg">{sceneSetup.characterName}</p>
                  {sceneSetup.genre && (
                    <p className="text-xs opacity-75 mt-1">{sceneSetup.genre}</p>
                  )}
                </div>
                <button
                  onClick={resetScene}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  New Scene
                </button>
              </div>

              <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-purple-50/30 to-transparent">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-md px-5 py-3 rounded-2xl shadow-md ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p className="text-xs font-semibold mb-1 opacity-75">
                        {msg.role === 'user' ? sceneSetup.characterName : sceneSetup.partnerCharacter}
                      </p>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 px-5 py-3 rounded-2xl shadow-md flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                      <span className="text-sm text-gray-600">Typing...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t bg-white p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={currentLine}
                    onChange={(e) => setCurrentLine(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !loading && sendLine()}
                    placeholder="Type your line..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={loading}
                  />
                  <button
                    onClick={sendLine}
                    disabled={loading || !currentLine.trim()}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Send className="w-5 h-5" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
