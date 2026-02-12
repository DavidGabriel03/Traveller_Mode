import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="w-64 h-full bg-slate-800 text-white flex flex-col p-6 shadow-2xl border-r border-slate-700">
      <h2 className="text-2xl font-black mb-10 text-indigo-400 italic">TRAVELLER</h2>
      
      <nav className="flex flex-col gap-4">
        <Link title="Harta" to="/" className="hover:bg-slate-700 p-3 rounded-lg transition-all font-medium">🌍 Explorator</Link>
        <Link title="Login" to="/login" className="hover:bg-slate-700 p-3 rounded-lg transition-all font-medium">🔑 Autentificare</Link>
        <Link title="Register" to="/register" className="hover:bg-slate-700 p-3 rounded-lg transition-all font-medium">📝 Înregistrare</Link>
      </nav>

      <div className="mt-auto text-xs text-slate-500 italic">v1.0 - Gata de drum</div>
    </div>
  );
}

export default Sidebar;