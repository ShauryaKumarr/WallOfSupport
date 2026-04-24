'use client';

import { useEffect, useState } from 'react';
import { subscribeToMessages } from '@/lib/db';
import type { Message } from '@/types';

export default function TopContributors() {
  const [contributors, setContributors] = useState<{ name: string; count: number }[]>([]);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const unsub = subscribeToMessages((messages: Message[]) => {
      const counts: Record<string, number> = {};
      messages.forEach((m) => {
        const name = m.username?.trim();
        if (name && name.toLowerCase() !== 'anonymous') {
          counts[name] = (counts[name] ?? 0) + 1;
        }
      });
      setContributors(
        Object.entries(counts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
      );
    });
    return unsub;
  }, []);

  const medals = ['🥇', '🥈', '🥉', '4.', '5.'];

  return (
    <div
      className="rounded-2xl shadow-md overflow-hidden"
      style={{ background: 'linear-gradient(150deg, #FFFDE7, #FFF9C4)' }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 font-semibold text-amber-900 hover:bg-amber-100/50 transition-colors text-sm"
        aria-expanded={open}
      >
        <span>🏆 Top Contributors</span>
        <span className="text-amber-500 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-5 pb-4 pt-1">
          {contributors.length === 0 ? (
            <p className="text-amber-600 text-xs italic">
              No contributors yet — be the first!
            </p>
          ) : (
            <ol className="flex flex-col gap-2.5">
              {contributors.map((c, i) => (
                <li key={c.name} className="flex items-center justify-between gap-2">
                  <span className="text-amber-900 text-sm font-medium flex items-center gap-1.5 min-w-0">
                    <span className="shrink-0 w-5">{medals[i]}</span>
                    <span className="truncate">{c.name}</span>
                  </span>
                  <span className="text-amber-600 text-xs shrink-0">
                    {c.count} post{c.count !== 1 ? 's' : ''}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
