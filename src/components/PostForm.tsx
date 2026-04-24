'use client';

import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { postMessage } from '@/lib/db';
import { moderateContent } from '@/lib/moderation';
import { useToast } from '@/context/ToastContext';
import { countries } from '@/lib/countries';

interface Props {
  open: boolean;
  onClose: () => void;
}

const MAX_CHARS = 250;

export default function PostForm({ open, onClose }: Props) {
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => usernameRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  function reset() {
    setUsername('');
    setMessage('');
    setLocation('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedMessage = message.trim();

    if (!trimmedUsername) {
      showToast('warning', 'Name required', 'Please enter your name or a username.');
      usernameRef.current?.focus();
      return;
    }
    if (!trimmedMessage) {
      showToast('warning', 'Message required', 'Please write something before posting.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await moderateContent(trimmedMessage);
      if (!result.passed) {
        showToast('error', 'Message not allowed', result.reason);
        return;
      }

      const now = new Date();
      await postMessage({
        username: trimmedUsername,
        message: trimmedMessage,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        ...(location ? { location } : {}),
      });

      showToast('success', 'Posted!', 'Your message has been added to the wall.');
      reset();
      onClose();
      // Celebrate!
      confetti({
        particleCount: 90,
        spread: 65,
        origin: { y: 0.55 },
        colors: ['#D97706', '#F59E0B', '#92400E', '#FBBF24', '#FDE68A', '#FEF3C7'],
      });
    } catch {
      showToast('error', 'Post failed', 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const remaining = MAX_CHARS - message.length;
  const counterColor =
    remaining < 20 ? 'text-red-500' : remaining < 60 ? 'text-amber-500' : 'text-amber-400';

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-amber-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet / modal */}
      <div className="relative w-full sm:max-w-md bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl p-6 sm:p-7 animate-slide-down">
        {/* Handle bar (mobile) */}
        <div className="w-10 h-1 rounded-full bg-amber-200 mx-auto mb-5 sm:hidden" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold" style={{ color: '#7C2D12' }}>
            Share Your Support
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-amber-600 hover:bg-amber-100 transition-colors text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-amber-700 mb-1.5">
              Your name <span className="text-red-400 normal-case">*</span>
            </label>
            <input
              ref={usernameRef}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.slice(0, 30))}
              placeholder="e.g. Alex or Anonymous"
              maxLength={30}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none text-amber-950 placeholder:text-amber-300 bg-amber-50/60 transition-colors text-sm"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-amber-700 mb-1.5">
              Your message <span className="text-red-400 normal-case">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Share words of encouragement, hope, or support…"
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none text-amber-950 placeholder:text-amber-300 bg-amber-50/60 transition-colors resize-none text-sm"
            />
            <p className={`text-xs text-right mt-1 font-medium ${counterColor}`}>
              {message.length} / {MAX_CHARS}
            </p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-amber-700 mb-1.5">
              Country{' '}
              <span className="text-amber-400 normal-case font-normal">(optional)</span>
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none text-amber-900 bg-amber-50/60 transition-colors text-sm"
            >
              <option value="">Select a country</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code.toLowerCase()}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center gap-2 text-sm mt-1"
            style={{ background: 'linear-gradient(135deg, #D97706, #C2410C)' }}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Checking &amp; posting…
              </>
            ) : (
              'Post to the Wall'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
