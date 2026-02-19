import { useNavigate, Link } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  
  // 1. Extragem user-ul din localStorage (salvat la Login)
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  // 2. Funcția de Logout care șterge tot și trimite user-ul la Login
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="w-64 h-full bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-black text-indigo-500 mb-8 italic tracking-tighter text-center">
          TRAVELLER
        </h1>
        
        <Link to="/" className="text-slate-300 hover:text-white transition-all py-2 px-4 rounded-lg hover:bg-slate-800">
          Home
        </Link>

        {/* 3. LOGICA DINAMICĂ: Afișăm link-uri în funcție de starea user-ului */}
        {!user ? (
          // DACĂ NU E LOGAT
          <>
            <Link to="/login" className="text-slate-300 hover:text-white py-2 px-4 rounded-lg hover:bg-slate-800">
              Login
            </Link>
            <Link to="/register" className="text-slate-300 hover:text-white py-2 px-4 rounded-lg hover:bg-slate-800">
              Register
            </Link>
          </>
        ) : (
          // DACĂ E LOGAT
          <>
            {user.role === "admin" ? (
              <Link to="/admin-dashboard" className="text-indigo-400 font-bold py-2 px-4 border-l-2 border-indigo-400 bg-indigo-500/5">
                Admin Panel
              </Link>
            ) : (
              <Link to="/user-dashboard" className="text-emerald-400 font-bold py-2 px-4 border-l-2 border-emerald-400 bg-emerald-500/5">
                My Travels
              </Link>
            )}
           <Link to="/profile" className="hover:bg-slate-800 p-3 rounded-lg transition-all border border-transparent hover:border-slate-700 font-medium">
   👤 Profilul Meu
</Link>
          </>
        )}
      </div>

      {/* 4. BUTONUL DE LOGOUT (apare doar dacă avem user) */}
      {user && (
        <button 
          onClick={handleLogout}
          className="bg-red-500/10 text-red-500 p-3 rounded-xl hover:bg-red-500/20 transition-all text-xs font-black uppercase tracking-widest"
        >
          Logout
        </button>
      )}
    </nav>
  );
}