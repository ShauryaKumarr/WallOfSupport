'use client';

interface HeaderProps {
  onShare: () => void;
  onInfo: () => void;
}

export default function Header({ onShare, onInfo }: HeaderProps) {
  return (
    <header className="relative text-center pt-12 pb-8 px-4">
      <button
        onClick={onInfo}
        aria-label="About this project"
        className="absolute top-6 right-6 w-9 h-9 rounded-full border-2 border-amber-600/60 text-amber-700 font-bold text-sm hover:bg-amber-100 hover:border-amber-600 transition-all duration-200 flex items-center justify-center"
      >
        i
      </button>

      <div className="flex items-center justify-center gap-3 mb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/globe.png"
          alt=""
          aria-hidden
          width={44}
          height={44}
          className="drop-shadow-md"
          style={{ animation: 'float 3s ease-in-out infinite' }}
        />
        <h1
          className="font-display text-4xl sm:text-5xl font-bold"
          style={{ color: '#7C2D12' }}
        >
          Wall of Support
        </h1>
      </div>

      <p className="text-amber-800 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
        A global community built on kindness — share a message that could change someone&apos;s day.
      </p>

      <button
        onClick={onShare}
        className="mt-6 inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-base"
        style={{ background: 'linear-gradient(135deg, #D97706, #C2410C)' }}
      >
        <span>✦</span> Share Your Support
      </button>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </header>
  );
}
