'use client';

import { useEffect, useMemo, useState } from 'react';
import { subscribeToMessages } from '@/lib/db';
import MessageCard from './MessageCard';
import type { Message } from '@/types';

type SortMode = 'latest' | 'loved';

export default function MessageWall() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortMode>('latest');

  useEffect(() => {
    const unsub = subscribeToMessages((msgs) => {
      setMessages(msgs);
      setLoading(false);
    });
    return unsub;
  }, []);

  const sorted = useMemo(() => {
    if (sort === 'loved') {
      return [...messages].sort((a, b) => b.likes - a.likes);
    }
    return messages; // already sorted by timestamp desc from db.ts
  }, [messages, sort]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-10 h-10 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Sort controls */}
      {messages.length > 0 && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-amber-700 text-xs font-medium mr-1">Sort:</span>
          {(['latest', 'loved'] as SortMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSort(mode)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
                ${sort === mode
                  ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                  : 'border-amber-300 bg-white/60 text-amber-700 hover:border-amber-400 hover:bg-amber-50'
                }`}
            >
              {mode === 'latest' ? '⏱ Latest' : '❤ Most Loved'}
            </button>
          ))}
          <span className="ml-auto text-amber-600 text-xs opacity-70">
            {messages.length} post{messages.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="text-center py-24 px-4">
          <p className="font-display text-2xl text-amber-700">No messages yet.</p>
          <p className="text-amber-600 mt-2 text-sm">Be the first to share your support!</p>
        </div>
      ) : (
        <div className="masonry">
          {sorted.map((m) => <MessageCard key={m.id} message={m} />)}
        </div>
      )}
    </div>
  );
}
