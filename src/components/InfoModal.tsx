'use client';

import { useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function InfoModal({ open, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-amber-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-slide-down max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl px-8 pt-7 pb-4 border-b border-amber-100 flex items-start justify-between gap-4 z-10">
          <div>
            <h2 className="font-display text-2xl font-bold" style={{ color: '#7C2D12' }}>
              Project Statement
            </h2>
            <p className="text-amber-600 text-xs mt-0.5">Wall of Support — by Shaurya Kumar</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-amber-600 hover:bg-amber-100 transition-colors text-2xl leading-none mt-0.5"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-4 text-amber-800 text-sm leading-relaxed">
          <p>
            Welcome to the Wall of Support! My name is Shaurya Kumar, and I started the journey
            of creating this project at the beginning of June. While I initially started this project
            to teach myself about API usage and Google&apos;s Firebase, I decided to make this educational
            project a meaningful one by creating a platform where people can come together to uplift each other.
          </p>
          <p>
            I think in today&apos;s world, especially with the advent of social media and the internet, it&apos;s
            easy to get caught up in the negativity that surrounds us. We let race disconnect us, religion
            separate us, politics divide us, and let wealth classify us — and every day, instead of coming
            together, we let these differences strain our relationships with one another.
          </p>
          <p>
            This is why I created the Wall of Support. I want this website to be a beacon of positivity in a
            world that currently seems to be becoming more and more divided. I want to remind people that while
            we may be different, we are all connected, we are all human, and we all deserve love and support.
          </p>
          <p>
            There are many people in this world who are currently struggling. No one truly knows what it is like
            to be in your shoes, and the struggles that you quietly face. Whether you are here to share
            encouragement or receive some words of support, I hope this website can be a place of positivity —
            not just for you, but also for a world that needs it. Thank you for visiting, and I hope you find
            something here that you can take with you!
          </p>

          <p className="font-semibold text-amber-700 pt-1">— Shaurya Kumar</p>
        </div>

        {/* Footer */}
        <div className="px-8 pb-7 pt-4 border-t border-amber-100 flex flex-wrap gap-4 text-xs">
          <a
            href="mailto:shauryakumar1709@gmail.com"
            className="text-amber-600 hover:text-amber-900 transition-colors"
          >
            ✉ shauryakumar1709@gmail.com
          </a>
          <a
            href="https://github.com/ShauryaKumarr"
            target="_blank"
            rel="noreferrer"
            className="text-amber-600 hover:text-amber-900 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/shauryak"
            target="_blank"
            rel="noreferrer"
            className="text-amber-600 hover:text-amber-900 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
