"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface BookButtonProps {
  showtimeId: string;
}

export default function BookButton({ showtimeId }: BookButtonProps) {
  const { status } = useSession();
  const router = useRouter();

  const handleBook = () => {
    if (status === "unauthenticated") {
      toast.error("Please sign in to book ticket", {
        style: {
          background: '#0d1117',
          color: '#fff',
          border: '1px solid #21262d'
        }
      });
      return;
    }
    
    router.push(`/showtime/${showtimeId}`);
  };

  return (
    <button 
      onClick={handleBook}
      className="w-full text-center bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black tracking-widest uppercase px-6 py-3.5 rounded-full transition-all shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] active:scale-95"
    >
      Book
    </button>
  );
}
