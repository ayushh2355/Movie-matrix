"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ProfileFormProps {
  user: {
    name: string | null;
    email: string | null;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name || "");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        toast.success("Profile updated successfully!");
        router.refresh(); 
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="bg-slate-900/30 border border-slate-800/50 rounded-3xl p-8 relative overflow-hidden">
      <h3 className="text-lg font-black text-white mb-6 tracking-wide">Personal Information</h3>
      
      <div className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-slate-200 font-medium outline-none transition-colors"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <div className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 font-medium opacity-70 cursor-not-allowed">
              {user.email}
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">Email address cannot be changed.</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-800/80 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving || name === user.name || !name.trim()}
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-black tracking-wider uppercase px-8 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] disabled:shadow-none cursor-pointer"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </section>
  );
}