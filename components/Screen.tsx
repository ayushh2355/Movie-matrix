export default function Screen() {
  return (
    <div className="w-full max-w-md flex flex-col items-center mb-10 relative">
      <div className="w-[85%] h-5 border-t-[3px] border-cyan-400/80 rounded-[100%] shadow-[0_-8px_16px_-4px_rgba(34,211,238,0.3)] relative flex items-center justify-center">
        <div className="absolute top-[3px] left-0 right-0 h-8 bg-linear-to-b from-cyan-500/10 to-transparent blur-md pointer-events-none" />
      </div>
      <span className="text-cyan-400 font-extrabold tracking-[0.25em] uppercase text-[10px] mt-2.5 select-none drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
        SCREEN
      </span>
    </div>
  );
}