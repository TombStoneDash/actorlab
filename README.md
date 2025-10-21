# 🎭 Actor Lab - AI Tools for Professional Actors

AI-powered platform providing professional tools for actors, casting directors, and entertainment professionals.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Add your OPENAI_API_KEY

# Run development server
npm run dev

# Visit http://localhost:3000
```

## ✨ Features

### 7 AI-Powered Tools:
1. **Resume & Cover Letter Generator** - Create professional acting resumes
2. **AI Scene Partner** - Practice scenes with intelligent AI responses
3. **Demo Reel Analyzer** - Get feedback on your performance reel
4. **Character Builder** - Deep character development analysis
5. **Smart Contact** - Professional networking message generator
6. **Actor Journal** - Track your acting journey
7. **Callback Tracker** - Manage auditions and callbacks

## 🛠️ Tech Stack

- **Next.js 14** (App Router + Pages Router)
- **OpenAI GPT-4** - AI-powered responses
- **Stripe** - Subscription management (optional)
- **Supabase** - User authentication (optional)
- **TailwindCSS** - Styling
- **TypeScript** - Type safety

## 🔐 Environment Variables

### Required:
```env
OPENAI_API_KEY=sk-xxx
NEXT_PUBLIC_BASE_URL=https://actorlab.tombstonedash.com
```

See `.env.example` for all available options.

## 🚢 Deployment to Vercel

```bash
vercel --prod
```

Configure environment variables in Vercel dashboard and set custom domain: `actorlab.tombstonedash.com`

## 📝 License

Part of the Tombstone Dash ecosystem. © 2025 Tombstone Dash LLC