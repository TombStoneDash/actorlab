'use client';

import Link from 'next/link';
import { FileText, Users, Video, Calendar, BookOpen, Mail, User } from 'lucide-react';

const tools = [
  {
    name: 'Resume & Cover Letter',
    description: 'AI-generated professional acting resumes and cover letters',
    path: '/lab/resume-coverletter',
    icon: FileText,
    color: 'bg-blue-500',
  },
  {
    name: 'Scene Partner',
    description: 'Practice scenes with an AI partner that adapts to your pace',
    path: '/lab/scene-partner',
    icon: Users,
    color: 'bg-green-500',
  },
  {
    name: 'Demo Reel Analyzer',
    description: 'Get AI-powered feedback on your demo reel performance',
    path: '/lab/demo-reel-analyzer',
    icon: Video,
    color: 'bg-red-500',
  },
  {
    name: 'Callback Tracker',
    description: 'Track auditions, callbacks, and booking rates',
    path: '/lab/callback-tracker',
    icon: Calendar,
    color: 'bg-yellow-500',
  },
  {
    name: 'Actor Journal',
    description: 'Document your acting journey and track progress',
    path: '/lab/actor-journal',
    icon: BookOpen,
    color: 'bg-purple-500',
  },
  {
    name: 'Smart Contact',
    description: 'AI-assisted networking and follow-up messages',
    path: '/lab/smart-contact',
    icon: Mail,
    color: 'bg-pink-500',
  },
  {
    name: 'Character Builder',
    description: 'Deep dive into character development with AI guidance',
    path: '/lab/character-builder',
    icon: User,
    color: 'bg-indigo-500',
  },
];

export default function LabDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-purple-900">
              🎭 Actor Lab
            </Link>
            <nav className="space-x-6">
              <Link href="/lab" className="text-purple-600 hover:text-purple-800 font-medium">
                Tools
              </Link>
              <Link href="https://tombstonedash.com" className="text-gray-600 hover:text-gray-800">
                Home
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Tool
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select from our suite of AI-powered tools designed to help you succeed in your acting career
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.path} href={tool.path}>
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer border border-gray-100">
                  <div className={`${tool.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{tool.name}</h2>
                  <p className="text-gray-600 text-sm">{tool.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p className="mb-2">All tools are powered by advanced AI technology</p>
          <p>
            Part of the{' '}
            <Link href="https://tombstonedash.com" className="text-purple-600 hover:text-purple-800 underline">
              Tombstone Dash
            </Link>{' '}
            ecosystem
          </p>
        </div>
      </main>
    </div>
  );
}
