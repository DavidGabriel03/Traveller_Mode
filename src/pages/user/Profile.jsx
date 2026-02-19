import React, { useState, useEffect } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Luăm datele userului logat din stocarea browserului
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  // ACEASTA LINIE ESTE CRUCIALĂ:
  if (!user) return <div className="p-20 text-white">Se încarcă profilul...</div>;

  return (
    <div className="p-8 text-white min-h-screen flex items-center justify-center">
      <div className={`bg-slate-900 border ${user.role === 'admin' ? 'border-indigo-500/50' : 'border-slate-800'} p-10 rounded-[40px] shadow-2xl w-full max-w-lg relative`}>
        
        {/* Badge special dacă este Admin */}
        {user.role === 'admin' && (
          <div className="absolute top-6 right-6 bg-indigo-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-indigo-500/20">
            Sistem Admin
          </div>
        )}

        <div className="flex flex-col items-center">
          {/* Avatar dinamic bazat pe prima literă */}
          <div className={`w-24 h-24 ${user.role === 'admin' ? 'bg-indigo-600' : 'bg-emerald-600'} rounded-3xl flex items-center justify-center text-3xl font-black mb-6 shadow-xl`}>
{user?.name ? user.name.charAt(0) : user?.email?.charAt(0).toUpperCase() || "?"}
          </div>

          <h1 className="text-3xl font-black italic uppercase mb-8">
            Profil <span className={user.role === 'admin' ? 'text-indigo-500' : 'text-emerald-500'}>Personal</span>
          </h1>

          <div className="w-full space-y-4">
            <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/30">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Email Cont</p>
              <p className="font-bold text-slate-200">{user.email}</p>
            </div>

            <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/30">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Rol Atribuit</p>
              <p className={`font-black uppercase text-xs ${user.role === 'admin' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                {user.role}
              </p>
            </div>
          </div>

          <button className="mt-10 w-full bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all">
            Schimbă Parola
          </button>
        </div>
      </div>
    </div>
  );
}