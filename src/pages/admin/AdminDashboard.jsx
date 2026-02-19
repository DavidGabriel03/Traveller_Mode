import React, { useState } from "react";

export default function AdminDashboard() {
  // 1. State pentru lista de utilizatori
  const [users, setUsers] = useState([
    { id: 1, name: "David Manu", email: "david@test.com", role: "admin" },
    { id: 2, name: "Andrei Ionescu", email: "andrei@user.com", role: "user" },
  ]);

  // 2. State pentru user-ul selectat spre editare (User Panel)
  const [selectedUser, setSelectedUser] = useState(null);

  // Funcție pentru salvarea modificărilor
  const handleSave = () => {
    setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
    setSelectedUser(null); // Închidem panel-ul după salvare
    alert("Datele au fost actualizate!");
  };

  return (
    <div className="p-8 text-white min-h-screen bg-slate-950">
      
      {/* DACĂ NU AVEM USER SELECTAT, ARĂTĂM HUB-UL (LISTA) */}
      {!selectedUser ? (
        <div className="max-w-5xl mx-auto">
          <header className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-black italic text-indigo-500 uppercase">Admin Hub</h1>
            <p className="text-slate-500 font-medium">Gestionează utilizatorii platformei</p>
          </header>

          <div className="grid gap-4">
            {users.map((user) => (
              <div key={user.id} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex justify-between items-center hover:border-indigo-500/50 transition-all shadow-xl">
                <div>
                  <p className="text-xl font-bold">{user.name}</p>
                  <p className="text-slate-500 text-sm">{user.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                    {user.role}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedUser(user)}
                  className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-2xl font-black text-sm transition-all active:scale-95"
                >
                  MODIFICĂ USER
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* DACĂ AVEM USER SELECTAT, ARĂTĂM USER PANEL-UL (FORMULARUL) */
        <div className="max-w-2xl mx-auto animate-in fade-in zoom-in duration-300">
          <button 
            onClick={() => setSelectedUser(null)}
            className="mb-6 text-slate-500 hover:text-white flex items-center gap-2 font-bold transition-all"
          >
            ← Înapoi la listă
          </button>

          <div className="bg-slate-900 p-10 rounded-[40px] border border-slate-800 shadow-2xl">
            <h2 className="text-3xl font-black mb-8 italic text-indigo-500">USER PANEL</h2>
            
            <div className="space-y-6">
              {/* Câmp Nume */}
              <div>
                <label className="text-xs font-black text-slate-500 uppercase ml-2 mb-2 block tracking-widest">Nume Complet</label>
                <input 
                  type="text" 
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                  className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 focus:border-indigo-500 outline-none transition-all font-medium text-white"
                />
              </div>

              {/* Câmp Rol */}
              <div>
                <label className="text-xs font-black text-slate-500 uppercase ml-2 mb-2 block tracking-widest">Rol Utilizator</label>
                <select 
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                  className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 focus:border-indigo-500 outline-none transition-all font-medium text-white appearance-none"
                >
                  <option value="user">USER</option>
                  <option value="admin">ADMIN</option>
                </select>
              </div>

              {/* Câmp Parolă */}
              <div>
                <label className="text-xs font-black text-slate-500 uppercase ml-2 mb-2 block tracking-widest">Resetează Parola</label>
                <input 
                  type="password" 
                  placeholder="Introdu o parolă nouă..."
                  onChange={(e) => setSelectedUser({...selectedUser, password: e.target.value})}
                  className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 focus:border-indigo-500 outline-none transition-all font-medium text-white"
                />
              </div>

              {/* Butoane Acțiune */}
              <div className="flex gap-4 pt-6">
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 p-5 rounded-2xl font-black text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                  SALVEAZĂ MODIFICĂRILE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}