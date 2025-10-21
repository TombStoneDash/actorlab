import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-4xl">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
          🎭 The Actor Lab
        </h1>
        <p className="text-2xl md:text-3xl mb-4 text-purple-200">
          AI-Powered Tools for Professional Actors
        </p>
        <p className="text-lg md:text-xl mb-12 text-purple-300 max-w-2xl mx-auto">
          Elevate your craft with cutting-edge AI tools designed specifically for actors.
          From resume building to scene practice, we've got you covered.
        </p>
        <Link href="/lab">
          <button className="bg-white text-purple-900 font-bold py-4 px-12 rounded-lg text-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl">
            Enter the Lab →
          </button>
        </Link>
        <div className="mt-16 text-purple-300 text-sm">
          <p>Powered by Tombstone Dash & CastAlert</p>
          <Link href="https://tombstonedash.com" className="underline hover:text-white">
            tombstonedash.com
          </Link>
        </div>
      </div>
    </div>
  );
}
