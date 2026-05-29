"use client";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import UserDropdown from "@/components/UserDropdown";

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Navbar({ searchQuery, setSearchQuery }: NavbarProps) {
  const { data: session } = useSession();

  return (
    <>
      <header className="bg-slate-900 border-b border-slate-800/80 sticky top-0 z-50 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="select-none">
            <span className="text-2xl font-black bg-linear-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent tracking-wide">
              MOVIE MATRIX
            </span>
          </Link>

          <div className="relative hidden md:block w-80">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for Movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 placeholder-slate-500 pl-10 pr-4 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 text-xs transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <UserDropdown user={session.user} />
          ) : (
            <button onClick={() => signIn("google")} className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 text-[11px] font-black tracking-wider uppercase px-4 py-1.5 rounded-lg transition-all">
              Sign In
            </button>
          )}
        </div>
      </header>

      <nav className="bg-slate-950 border-b border-slate-900 px-4 md:px-8 py-2.5 flex items-center justify-between text-[11px] font-semibold text-slate-400 select-none">
        <div className="flex items-center gap-6 overflow-x-auto">
          <Link href="/" className="text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider">Movies</Link>
          <span className="hover:text-slate-200 transition-colors cursor-pointer uppercase tracking-wider">Stream</span>
          <span className="hover:text-slate-200 transition-colors cursor-pointer uppercase tracking-wider">Events</span>
          <span className="hover:text-slate-200 transition-colors cursor-pointer uppercase tracking-wider">Plays</span>
          <span className="hover:text-slate-200 transition-colors cursor-pointer uppercase tracking-wider">Sports</span>
          <span className="hover:text-slate-200 transition-colors cursor-pointer uppercase tracking-wider">Activities</span>
          <span className="text-slate-600">|</span>
          <span className="hover:text-slate-200 transition-colors cursor-pointer text-cyan-400 uppercase tracking-wider">TATA IPL 2026</span>
        </div>
      </nav>
    </>
  );
}