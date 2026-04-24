'use client';

import { useEffect, useState } from 'react';
import { quotes } from '@/lib/quotes';

export default function QuoteRotator() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % quotes.length);
        setVisible(true);
      }, 500);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center px-6 mb-8">
      <p
        className="text-amber-700 italic text-sm sm:text-base max-w-2xl mx-auto transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0 }}
      >
        &ldquo;{quotes[index]}&rdquo;
      </p>
    </div>
  );
}
