'use client';

import { useEffect, useState } from 'react';
import { likeMessage } from '@/lib/db';
import { useToast } from '@/context/ToastContext';
import type { Message } from '@/types';

interface Props {
  message: Message;
}

function getLikedMessages(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('likedMessages') ?? '[]');
  } catch {
    return [];
  }
}

export default function MessageCard({ message }: Props) {
  const { showToast } = useToast();
  const [likes, setLikes] = useState(message.likes);
  const [liked, setLiked] = useState(false);
  const [popping, setPopping] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiked(getLikedMessages().includes(message.id));
  }, [message.id]);

  // Sync with Firebase — single source of truth for the count
  useEffect(() => {
    setLikes(message.likes);
  }, [message.likes]);

  async function handleLike() {
    if (liked) {
      showToast('info', 'Already liked', "You've already liked this message.");
      return;
    }
    if (loading) return;

    setLoading(true);
    try {
      await likeMessage(message.id);
      const likedList = getLikedMessages();
      likedList.push(message.id);
      localStorage.setItem('likedMessages', JSON.stringify(likedList));
      // Don't manually increment — Firebase subscription updates the count via the useEffect above
      setLiked(true);
      setPopping(true);
      setTimeout(() => setPopping(false), 500);
    } catch {
      showToast('error', 'Like failed', 'Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="masonry-item">
      <div
        className="relative rounded-xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 animate-fade-in"
        style={{ background: 'linear-gradient(150deg, #FFFDE7 0%, #FFF9C4 50%, #FFF176 100%)' }}
      >
        {/* Thumbtack */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full shadow-md flex items-center justify-center"
          style={{ background: '#92400E' }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
        </div>

        {/* Country flag */}
        {message.location && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://flagcdn.com/24x18/${message.location}.png`}
            alt={message.location.toUpperCase()}
            width={24}
            height={18}
            className="absolute top-4 right-4 rounded-sm shadow-sm opacity-90"
          />
        )}

        {/* Message text */}
        <p
          className="text-amber-950 text-sm leading-relaxed mt-2 pr-8 break-words"
          style={{ wordBreak: 'break-word' }}
        >
          {message.message}
        </p>

        {/* Footer */}
        <div className="flex items-end justify-between mt-4 gap-2">

          {/* Like button */}
          <button
            onClick={handleLike}
            disabled={loading}
            aria-label={`Like this message — ${likes} like${likes !== 1 ? 's' : ''}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold
              transition-all duration-200 select-none active:scale-90
              ${liked
                ? 'border-red-200 bg-red-50 text-red-600'
                : 'border-amber-200 bg-amber-50/80 text-amber-600 hover:border-red-200 hover:bg-red-50/60 hover:text-red-500'
              } disabled:opacity-40`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-3.5 h-3.5 transition-colors duration-300 ${popping ? 'heart-pop' : ''}`}
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="tabular-nums">{likes}</span>
          </button>

          {/* Author / date */}
          <div className="text-right min-w-0">
            <p className="text-amber-900 text-xs font-semibold truncate">{message.username}</p>
            <p className="text-amber-700 text-xs opacity-60 mt-0.5">
              {message.date} · {message.time}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
