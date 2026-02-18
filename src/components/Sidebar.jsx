import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-full bg-slate-900 text-white flex flex-col p-6 shadow-2xl border-r border-slate-800 z-[1000]">
      <h2 className="text-2xl font-black mb-10 text-indigo-500 italic tracking-tighter uppercase">
        Traveller
      </h2>

      <nav className="flex flex-col gap-4">
        <Link
          to="/"
          className="hover:bg-slate-800 p-3 rounded-lg transition-all border border-transparent hover:border-slate-700 font-medium"
        >
          Explorator
        </Link>

        <Link
          to="/login"
          className="hover:bg-slate-800 p-3 rounded-lg transition-all border border-transparent hover:border-slate-700 font-medium"
        >
          Autentificare
        </Link>

        <Link
          to="/register"
          className="hover:bg-slate-800 p-3 rounded-lg transition-all border border-transparent hover:border-slate-700 font-medium"
        >
          Înregistrare
        </Link>
      </nav>
    </div>
  );
}
