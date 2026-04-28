'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import QuoteRotator from '@/components/QuoteRotator';
import WallStats from '@/components/WallStats';
import MessageWall from '@/components/MessageWall';
import PostForm from '@/components/PostForm';
import TopContributors from '@/components/TopContributors';
import InfoModal from '@/components/InfoModal';
import Footer from '@/components/Footer';

const GlobeView = dynamic(() => import('@/components/GlobeView'), { ssr: false });

type View = 'wall' | 'globe';

const VIEWS: { id: View; icon: string; label: string }[] = [
  { id: 'wall', icon: '📋', label: 'Wall' },
  { id: 'globe', icon: '🌍', label: 'Globe' },
];

export default function Home() {
  const [formOpen, setFormOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [view, setView] = useState<View>('wall');

  return (
    <div className="min-h-screen" style={{ background: '#F5F5DC' }}>
      <Header onShare={() => setFormOpen(true)} onInfo={() => setInfoOpen(true)} />
      <QuoteRotator />
      <WallStats />

      {/* View toggle */}
      <div className="flex justify-center mb-6 px-4">
        <div
          className="flex rounded-full p-1 gap-1"
          style={{ background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.2)' }}
        >
          {VIEWS.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                view === id
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-amber-700 hover:text-amber-900 hover:bg-amber-100/60'
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-28">
        {view === 'globe' ? (
          <GlobeView />
        ) : (
          <div className="flex gap-6 items-start">
            {/* Sidebar — desktop only */}
            <aside className="hidden lg:block w-60 shrink-0 sticky top-6">
              <TopContributors />
            </aside>

            {/* Message wall */}
            <div className="flex-1 min-w-0">
              <MessageWall />
            </div>
          </div>
        )}

        {/* Top contributors below wall on mobile/tablet (wall view only) */}
        {view === 'wall' && (
          <div className="lg:hidden mt-10">
            <TopContributors />
          </div>
        )}
      </main>

      <PostForm open={formOpen} onClose={() => setFormOpen(false)} />
      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
      <Footer />
    </div>
  );
}
