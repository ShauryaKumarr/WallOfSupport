'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import QuoteRotator from '@/components/QuoteRotator';
import WallStats from '@/components/WallStats';
import MessageWall from '@/components/MessageWall';
import PostForm from '@/components/PostForm';
import TopContributors from '@/components/TopContributors';
import InfoModal from '@/components/InfoModal';
import Footer from '@/components/Footer';

export default function Home() {
  const [formOpen, setFormOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: '#F5F5DC' }}>
      <Header onShare={() => setFormOpen(true)} onInfo={() => setInfoOpen(true)} />
      <QuoteRotator />
      <WallStats />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-28">
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

        {/* Top contributors below wall on mobile/tablet */}
        <div className="lg:hidden mt-10">
          <TopContributors />
        </div>
      </main>

      <PostForm open={formOpen} onClose={() => setFormOpen(false)} />
      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
      <Footer />
    </div>
  );
}
