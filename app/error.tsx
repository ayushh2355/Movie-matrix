"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f1a] text-slate-300 p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
        <svg className="w-16 h-16 mx-auto text-amber-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-2xl font-black tracking-wider uppercase text-slate-100 mb-3">
          Connection Error
        </h2>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          We couldn't connect to the database. Please check your internet connection and try again.
        </p>
        <button
          onClick={() => reset()}
          className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-black tracking-wider uppercase rounded-xl transition-all shadow-[0_0_15px_rgba(245,197,24,0.3)] hover:shadow-[0_0_25px_rgba(245,197,24,0.5)]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}