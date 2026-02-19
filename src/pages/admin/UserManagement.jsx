import React, { useState } from "react";

export default function UserManagement() {
  // 1. Statul pentru lista de utilizatori (simulat pentru moment)
  const [users, setUsers] = useState([
    { id: 1, name: "David Manu", email: "david@test.com", role: "admin" },
    { id: 2, name: "Elena Popa", email: "elena@user.com", role: "user" },
    { id: 3, name: "Mihai Vizitiu", email: "mihai@user.com", role: "user" },
  ]);

  // 2. Statul pentru user-ul pe care îl edităm în prezent
  const [editingUser, setEditingUser] = useState(null);

  // Funcție pentru a salva modificările
  const handleSave = () => {
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
    alert("Modificările au fost salvate cu succes!");
  };

  return (
    <div className="p-8 text-white min-h-screen bg-slate-950">
      <header className="mb-10">
        <h1 className="text-3xl font-black italic text-indigo-500 uppercase tracking-tighter">
          Gestionare <span className="text-white">Utilizatori</span>
        </h1>
        <p className="text-slate-500 text-sm font-medium">Modifică numele, parolele și rolurile membrilor platformei.</p>
      </header>

      {/* LISTA DE UTILIZATORI */}
      <div className="grid gap-4 max-w-4xl">
        {users.map((user) => (
          <div key={user.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex justify-between items-center hover:border-slate-700 transition-all shadow-lg">
            <div>
              <p className="font-bold text-lg leading-tight">{user.name}</p>
              <p className="text-slate-500 text-xs mb-2">{user.email}</p>
              <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                {user.role}
              </span>
            </div>
            <button 
              onClick={() => setEditingUser({...user, password: ""})}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95"
            >
              MODIFICĂ
            </button>
          </div>
        ))}
      </div>

      {/* MODAL / PANEL DE EDITARE (Apare doar când dai click pe Modifică) */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[2000] p-4">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-[32px] w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <h2 className="text-2xl font-black mb-6 italic text-white uppercase tracking-tighter text-center">Editare Utilizator</h2>
            
            <div className="space-y-5">
              {/* Nume */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-1 block">Nume Complet</label>
                <input 
                  type="text" 
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 focus:border-indigo-500 outline-none text-white font-medium transition-all"
                />
              </div>

              {/* Rol */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-1 block">Rol Acces</label>
                <select 
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 focus:border-indigo-500 outline-none text-white font-medium transition-all appearance-none"
                >
                  <option value="user">USER</option>
                  <option value="admin">ADMIN</option>
                </select>
              </div>

              {/* Parolă */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-1 block">Resetare Parolă</label>
                <input 
                  type="password" 
                  placeholder="Introdu parola noua..."
                  onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                  className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 focus:border-indigo-500 outline-none text-white font-medium transition-all"
                />
              </div>
            </div>

            {/* Butoane Acțiune */}
            <div className="flex gap-3 mt-8">
              <button 
                onClick={handleSave}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-2xl font-black text-sm transition-all"
              >
                SALVEAZĂ
              </button>
              <button 
                onClick={() => setEditingUser(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-400 p-4 rounded-2xl font-black text-sm transition-all"
              >
                ANULEAZĂ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}