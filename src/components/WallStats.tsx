'use client';

import { useEffect, useState } from 'react';
import { subscribeToMessages } from '@/lib/db';
import type { Message } from '@/types';

export default function WallStats() {
  const [count, setCount] = useState<number | null>(null);
  const [countries, setCountries] = useState<number | null>(null);

  useEffect(() => {
    const unsub = subscribeToMessages((messages: Message[]) => {
      setCount(messages.length);
      const unique = new Set(messages.map((m) => m.location).filter(Boolean));
      setCountries(unique.size);
    });
    return unsub;
  }, []);

  if (count === null) return null;

  return (
    <div className="flex items-center justify-center gap-6 sm:gap-10 py-3 mb-6">
      <Stat
        icon="💬"
        value={count.toLocaleString()}
        label={count === 1 ? 'message' : 'messages'}
      />
      {countries !== null && countries > 0 && (
        <>
          <div className="w-px h-8 bg-amber-300/60" />
          <Stat
            icon="🌍"
            value={countries.toLocaleString()}
            label={countries === 1 ? 'country' : 'countries'}
          />
        </>
      )}
    </div>
  );
}

function Stat({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-amber-800">
      <span className="text-xl">{icon}</span>
      <div>
        <span className="font-bold text-lg leading-none tabular-nums">{value}</span>
        <span className="text-xs text-amber-600 ml-1">{label}</span>
      </div>
    </div>
  );
}
