import React from "react";

// ESENȚIAL: Trebuie să ai "export default" aici
export default function Profile() {
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        <p className="bg-red-500/20 border border-red-500 p-6 rounded-2xl">
          Trebuie să fii logat pentru a accesa profilul.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full bg-slate-950 p-6">
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-black text-white italic mb-6 border-b border-slate-800 pb-4">
          PROFIL UTILIZATOR
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase">Email</p>
            <p className="text-white text-lg">{user.email}</p>
          </div>
          <div>
            <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase">Rol acces</p>
            <span className="inline-block mt-1 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold border border-indigo-500/20">
              {user.role.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}