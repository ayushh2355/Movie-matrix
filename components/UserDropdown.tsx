"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface UserDropdownProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg font-black text-amber-500 border-2 border-slate-700 shadow-inner hover:border-amber-500 transition-colors focus:outline-none"
      >
        {initials}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-slate-800">
            <p className="text-sm font-bold text-slate-200 truncate">{user?.name || "User"}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <div className="py-1">
            <Link 
              href="/profile" 
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-amber-500 transition-colors"
            >
              Profile
            </Link>
            <Link 
              href="/tickets" 
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-amber-500 transition-colors"
            >
              View Tickets
            </Link>
          </div>
          <div className="py-1 border-t border-slate-800">
            <button 
              onClick={() => signOut()}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-rose-500 hover:bg-slate-800 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
