import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
          <Compass className="w-8 h-8 stroke-[1.5]" />
        </div>
        <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#8C827A] block">
          Error 404
        </span>
        <h1 className="font-serif text-4xl text-zinc-950 font-normal">
          Page Not Found
        </h1>
        <p className="text-zinc-600 text-sm leading-relaxed">
          The fragrance trail seems to have faded. The page you are looking for does not exist or has been relocated.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#121212] hover:bg-black text-[#FAF9F6] text-xs uppercase tracking-[0.2em] font-semibold rounded-full shadow-lg transition-transform active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
