import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const links = (
    <div className="flex flex-col gap-4">
      <p className="text-2xl font-black text-indigo-500 mb-8 text-center">
        TRAVELLER
      </p>
      <Link to="/" onClick={() => setOpen(false)} className="text-slate-300 hover:text-white transition-all py-2 px-4 rounded-lg hover:bg-slate-800">
        Home
      </Link>

      {!user ? (
        <>
          <Link to="/login" onClick={() => setOpen(false)} className="text-slate-300 hover:text-white py-2 px-4 rounded-lg hover:bg-slate-800">
            Login
          </Link>
          <Link to="/register" onClick={() => setOpen(false)} className="text-slate-300 hover:text-white py-2 px-4 rounded-lg hover:bg-slate-800">
            Register
          </Link>
        </>
      ) : (
        <>
          {user.role === "admin" ? (
            <Link to="/admin-dashboard" onClick={() => setOpen(false)} className="text-indigo-400 font-bold py-2 px-4 border-l-2 border-indigo-400 bg-indigo-500/5">
              Admin Panel
            </Link>
          ) : (
            <Link to="/user-dashboard" onClick={() => setOpen(false)} className="text-emerald-400 font-bold py-2 px-4 border-l-2 border-emerald-400 bg-emerald-500/5">
              My Travels
            </Link>
          )}
          <Link to="/profile" onClick={() => setOpen(false)} className="text-slate-300 hover:text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition-all">
            Profilul Meu
          </Link>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* MOBILE — buton hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-[2000]">
        <button
          onClick={() => setOpen(!open)}
          className="bg-slate-900 border border-slate-700 text-white p-2 rounded-xl"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE — drawer care apare */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[1500] bg-black/60" onClick={() => setOpen(false)}>
          <nav
            className="w-64 h-full bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between"
            onClick={e => e.stopPropagation()}
          >
            {links}
            {user && (
              <button
                onClick={handleLogout}
                className="bg-red-500/10 text-red-500 p-3 rounded-xl hover:bg-red-500/20 transition-all text-xs font-black uppercase tracking-widest"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}

      {/* DESKTOP — sidebar normal */}
      <nav className="hidden md:flex w-64 h-full bg-slate-900 border-r border-slate-800 p-6 flex-col justify-between">
        {links}
        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500/10 text-red-500 p-3 rounded-xl hover:bg-red-500/20 transition-all text-xs font-black uppercase tracking-widest"
          >
            Logout
          </button>
        )}
      </nav>
    </>
  );
}