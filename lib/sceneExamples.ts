export type Scene = {
  id: string;
  title: string;
  genre: string;
  roles: [string, string];
  description: string;
  lines: Array<{ speaker: string; text: string }>;
  beats?: string[];
};

export const BUILT_IN_SCENES: Scene[] = [
  {
    id: 'med-01',
    title: 'Triage Bay 3',
    genre: 'Medical Drama',
    roles: ['Dr. Alex Chen', 'Dr. Rivera'],
    description: 'ER crisis - two doctors disagree on treatment under pressure',
    lines: [
      { speaker: 'Dr. Alex Chen', text: "We don't have time for this! Start the transfusion now or we lose him!" },
      { speaker: 'Dr. Rivera', text: "His blood type hasn't come back yet. We could kill him faster." },
      { speaker: 'Dr. Alex Chen', text: "O-negative. Universal donor. You know the protocol." },
      { speaker: 'Dr. Rivera', text: "The protocol also says confirm before we pump unknown blood into a trauma patient!" },
      { speaker: 'Dr. Alex Chen', text: "Look at his vitals! He's crashing. Make the call, Rivera!" },
      { speaker: 'Dr. Rivera', text: "Fine. O-neg, two units. But if this goes south—" },
      { speaker: 'Dr. Alex Chen', text: "It won't. Trust me." },
    ],
    beats: ['Urgent', 'Life-or-death stakes', 'Professional conflict', 'Quick decision-making']
  },

  {
    id: 'crime-01',
    title: 'Late Shift',
    genre: 'Crime/Detective',
    roles: ['Detective Morgan', 'Suspect Hale'],
    description: 'Interrogation room - detective has evidence, needs confession',
    lines: [
      { speaker: 'Detective Morgan', text: "I know you were there that night, Hale. Your car was on the traffic cam two blocks away." },
      { speaker: 'Suspect Hale', text: "Lots of cars look like mine. Black sedans are pretty common." },
      { speaker: 'Detective Morgan', text: "With your custom plates? H-A-L-3-0-0? Not so common." },
      { speaker: 'Suspect Hale', text: "I was in the neighborhood. That's not a crime." },
      { speaker: 'Detective Morgan', text: "Being in the neighborhood at 11:47 PM, the exact time of the break-in?" },
      { speaker: 'Suspect Hale', text: "Coincidence." },
      { speaker: 'Detective Morgan', text: "Your fingerprints on the back door handle. Also a coincidence?" },
      { speaker: 'Suspect Hale', text: "I want my lawyer." },
    ],
    beats: ['Controlled intensity', 'Cat and mouse', 'Strategic questioning', 'Rising tension']
  },

  {
    id: 'romcom-01',
    title: 'The Elevator Pitch',
    genre: 'Romantic Comedy',
    roles: ['Sam', 'Jamie'],
    description: 'Stuck in elevator with ex - awkward romantic tension',
    lines: [
      { speaker: 'Sam', text: "I swear I'm not following you. We just work on the same floors now, apparently." },
      { speaker: 'Jamie', text: "Right. The universe and its impeccable timing." },
      { speaker: 'Sam', text: "Or... a broken elevator." },
      { speaker: 'Jamie', text: "Either way, you finally have two minutes to pitch that apology you've been working on." },
      { speaker: 'Sam', text: "Who says I've been working on an apology?" },
      { speaker: 'Jamie', text: "Please. I know that look. You've been rehearsing." },
      { speaker: 'Sam', text: "Okay, fine. I'm sorry. I was an idiot. A coward. And I should have—" },
      { speaker: 'Jamie', text: "Stopped at 'idiot.' That one I believe." },
      { speaker: 'Sam', text: "Can we start over? New floor, new chance?" },
      { speaker: 'Jamie', text: "We're stuck between floors, Sam." },
      { speaker: 'Sam', text: "Exactly. Nowhere to go but up." },
    ],
    beats: ['Awkward humor', 'Vulnerability', 'Romantic tension', 'Witty banter']
  },

  {
    id: 'hero-01',
    title: 'Save the City',
    genre: 'Superhero/Action',
    roles: ['Blaze', 'Oracle'],
    description: 'Hero must choose between saving civilians or stopping villain',
    lines: [
      { speaker: 'Blaze', text: "You know I can't let them die. Get the civilians out. I'm going after Vortex alone." },
      { speaker: 'Oracle', text: "You'll never make it. He's got the entire building rigged." },
      { speaker: 'Blaze', text: "Then I'll have to be faster than an explosion. Wouldn't be the first time." },
      { speaker: 'Oracle', text: "Your powers are at 40%. You're not invincible, Blaze!" },
      { speaker: 'Blaze', text: "I don't need to be invincible. I just need to be enough." },
      { speaker: 'Oracle', text: "This is suicide!" },
      { speaker: 'Blaze', text: "No. This is what we signed up for. Now GO!" },
    ],
    beats: ['Heroic determination', 'High stakes', 'Sacrifice', 'Quick action']
  },

  {
    id: 'kitchen-01',
    title: 'The Bear Trap',
    genre: 'Restaurant Drama',
    roles: ['Chef Luca', 'Sous Chef Mara'],
    description: 'Kitchen chaos during dinner rush - critic in dining room',
    lines: [
      { speaker: 'Chef Luca', text: "Behind! BEHIND! Mara, where are my scallops? Table six has been waiting twenty minutes!" },
      { speaker: 'Sous Chef Mara', text: "Scallops are up in thirty seconds. We had to start a new batch." },
      { speaker: 'Chef Luca', text: "Why? What happened to the first batch?" },
      { speaker: 'Sous Chef Mara', text: "Marco burned them. All twelve." },
      { speaker: 'Chef Luca', text: "Are you KIDDING me? The Times critic is at table six!" },
      { speaker: 'Sous Chef Mara', text: "I know! I'm fixing it!" },
      { speaker: 'Chef Luca', text: "You don't fix perfection, you execute it the first time! Plate it. Now!" },
      { speaker: 'Sous Chef Mara', text: "Yes, Chef!" },
    ],
    beats: ['High energy', 'Professional pressure', 'Controlled chaos', 'Intensity']
  },

  {
    id: 'teen-01',
    title: 'Hallway Whisper',
    genre: 'Coming-of-Age',
    roles: ['Jamie', 'Taylor'],
    description: 'High school hallway - confession about secret crush',
    lines: [
      { speaker: 'Jamie', text: "I need to tell you something and I need you to not make it weird." },
      { speaker: 'Taylor', text: "When you start like that, it's already weird." },
      { speaker: 'Jamie', text: "I'm serious. This is... it's important." },
      { speaker: 'Taylor', text: "Okay. I'm listening." },
      { speaker: 'Jamie', text: "I think I like someone. Like, really like them. And I don't know what to do about it." },
      { speaker: 'Taylor', text: "Wait. You? The person who plans everything three months in advance doesn't have a plan?" },
      { speaker: 'Jamie', text: "There's no plan for this! What if they don't feel the same way?" },
      { speaker: 'Taylor', text: "Then they're an idiot. But you'll never know unless you tell them." },
      { speaker: 'Jamie', text: "What if it ruins everything?" },
      { speaker: 'Taylor', text: "What if it doesn't?" },
    ],
    beats: ['Nervous vulnerability', 'Friendship support', 'Teen anxiety', 'Emotional honesty']
  },

  {
    id: 'thriller-01',
    title: "Don't Look Down",
    genre: 'Thriller/Horror',
    roles: ['Sam', 'Morgan'],
    description: 'Dark basement - something moving behind locked door',
    lines: [
      { speaker: 'Sam', text: "Did you hear that? No, shut up and listen. There it is again." },
      { speaker: 'Morgan', text: "It's probably just the pipes. Old buildings—" },
      { speaker: 'Sam', text: "Pipes don't scratch. Something's moving down there." },
      { speaker: 'Morgan', text: "The door's locked. We should call the police." },
      { speaker: 'Sam', text: "No signal. We're on our own." },
      { speaker: 'Morgan', text: "Then we leave. Now." },
      { speaker: 'Sam', text: "The scratching stopped." },
      { speaker: 'Morgan', text: "That's worse. That's so much worse." },
    ],
    beats: ['Whispered tension', 'Building dread', 'Controlled panic', 'Suspense']
  },

  {
    id: 'period-01',
    title: 'The Proposal',
    genre: 'Period Drama',
    roles: ['Lady Catherine', 'Lord Blackwood'],
    description: 'Drawing room, 1815 - marriage proposal gone wrong',
    lines: [
      { speaker: 'Lord Blackwood', text: "Lady Catherine, I come before you with a proposal of marriage." },
      { speaker: 'Lady Catherine', text: "How perfectly... direct of you, my lord." },
      { speaker: 'Lord Blackwood', text: "My estates require an heir. Your family requires financial security. It is, as they say, mutually beneficial." },
      { speaker: 'Lady Catherine', text: "A marriage of convenience. How perfectly mercenary. Did you rehearse this insult?" },
      { speaker: 'Lord Blackwood', text: "I assure you, I meant no insult. I speak only of practicality." },
      { speaker: 'Lady Catherine', text: "Practicality. Yes. How romantic. Tell me, did you bring a contract, or shall we discuss terms over tea?" },
      { speaker: 'Lord Blackwood', text: "Lady Catherine, I—" },
      { speaker: 'Lady Catherine', text: "Save your breath, my lord. I'd sooner marry the gardener." },
    ],
    beats: ['Refined anger', 'Sharp wit', 'Wounded pride', 'Social tension']
  },

  {
    id: 'sports-01',
    title: 'Locker Room',
    genre: 'Sports Drama',
    roles: ['Coach Rivera', 'Star Player Jackson'],
    description: 'Halftime - team losing, player wants to quit',
    lines: [
      { speaker: 'Coach Rivera', text: "You walk out that door now, you're not just quitting on me. You're quitting on every kid who looks up to you." },
      { speaker: 'Star Player Jackson', text: "Those kids don't know what it's like. The pressure, the expectations—" },
      { speaker: 'Coach Rivera', text: "You think I don't know pressure? I played in the same system you did!" },
      { speaker: 'Star Player Jackson', text: "And look where it got you. Coaching high school ball instead of the pros." },
      { speaker: 'Coach Rivera', text: "You know what? You're right. I didn't make it. But I'm still here. Still fighting. Can you say the same?" },
      { speaker: 'Star Player Jackson', text: "Coach, I—" },
      { speaker: 'Coach Rivera', text: "No. You listen. Talent gets you in the door. Heart keeps you in the game. What's it gonna be?" },
    ],
    beats: ['Passionate', 'Motivational', 'Tough love', 'Inspiring']
  },

  {
    id: 'workplace-01',
    title: 'The Performance Review',
    genre: 'Workplace Comedy',
    roles: ['Taylor', 'Boss Linda'],
    description: 'Office meeting - absurd corporate feedback destroys promotion dreams',
    lines: [
      { speaker: 'Boss Linda', text: "Taylor, your synergy with the team's paradigm shift needs work." },
      { speaker: 'Taylor', text: "I'm sorry, could you... could you define that? In actual words?" },
      { speaker: 'Boss Linda', text: "Your collaborative dynamic vis-à-vis our core competencies shows minimal bandwidth optimization." },
      { speaker: 'Taylor', text: "Are you... are you speaking English right now?" },
      { speaker: 'Boss Linda', text: "I'm trying to help you level up your value proposition." },
      { speaker: 'Taylor', text: "Linda. I sell paper. I sell PAPER. What does any of this mean?" },
      { speaker: 'Boss Linda', text: "This attitude is exactly why we can't move you to senior sales associate." },
      { speaker: 'Taylor', text: "I've been here seven years!" },
      { speaker: 'Boss Linda', text: "And with the right mindset pivot, maybe seven more until promotion!" },
    ],
    beats: ['Confused frustration', 'Absurd humor', 'Corporate satire', 'Suppressed anger']
  },

  {
    id: 'family-01',
    title: 'The Truth',
    genre: 'Family Drama',
    roles: ['Jordan', 'Mom Patricia'],
    description: 'Living room - devastating secret revealed after 20 years',
    lines: [
      { speaker: 'Jordan', text: "How could you keep this from me? Twenty years, Mom. TWENTY YEARS of lies!" },
      { speaker: 'Mom Patricia', text: "I was protecting you. You were just a child—" },
      { speaker: 'Jordan', text: "I'm not a child anymore! I deserved to know the truth!" },
      { speaker: 'Mom Patricia', text: "The truth would have destroyed you! It would have destroyed us!" },
      { speaker: 'Jordan', text: "And what do you think this is doing? Right now? How am I supposed to trust anything you've ever told me?" },
      { speaker: 'Mom Patricia', text: "Jordan, please. Let me explain—" },
      { speaker: 'Jordan', text: "Explain what? That my entire life has been built on a lie? Save it." },
      { speaker: 'Mom Patricia', text: "I did what I thought was right!" },
      { speaker: 'Jordan', text: "Well you thought wrong." },
    ],
    beats: ['Raw emotion', 'Betrayal', 'Building anger', 'Hurt']
  },

  {
    id: 'scifi-01',
    title: 'First Contact',
    genre: 'Sci-Fi',
    roles: ['Dr. Rodriguez', 'Commander Hayes'],
    description: 'Space station - first confirmed alien transmission detected',
    lines: [
      { speaker: 'Dr. Rodriguez', text: "It's not random noise. This is a pattern. An algorithm. Someone out there is trying to reach us." },
      { speaker: 'Commander Hayes', text: "You're certain? This isn't another false positive?" },
      { speaker: 'Dr. Rodriguez', text: "I've run it through every filter we have. This is deliberate. This is... it's a message." },
      { speaker: 'Commander Hayes', text: "Can you decode it?" },
      { speaker: 'Dr. Rodriguez', text: "Not yet. But the mathematical structure is beautiful. Elegant. Whoever sent this is... advanced." },
      { speaker: 'Commander Hayes', text: "Or dangerous. We need to inform Earth Command before we respond." },
      { speaker: 'Dr. Rodriguez', text: "By the time they make a decision, the signal will be gone. We have to answer NOW." },
      { speaker: 'Commander Hayes', text: "And if we're making first contact with something hostile?" },
      { speaker: 'Dr. Rodriguez', text: "Then at least we'll know we're not alone." },
    ],
    beats: ['Scientific awe', 'Wonder', 'Tension', 'Discovery']
  },
];

export function getSceneById(id: string): Scene | undefined {
  return BUILT_IN_SCENES.find(scene => scene.id === id);
}

export function getScenesByGenre(genre: string): Scene[] {
  return BUILT_IN_SCENES.filter(scene => scene.genre === genre);
}

export function getAllGenres(): string[] {
  const genreSet = new Set(BUILT_IN_SCENES.map(scene => scene.genre));
  return Array.from(genreSet);
}
