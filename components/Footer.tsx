export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-[10px] text-slate-600 select-none mt-auto">
      &copy; {new Date().getFullYear()} Movie Matrix. Redesigned with premium cinema theme inspired by BookMyShow.
    </footer>
  );
}