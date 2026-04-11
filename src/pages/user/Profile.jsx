import React, { useState, useEffect } from "react";

export default function Profile() {
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const token = localStorage.getItem("token");

  const [visits, setVisits] = useState([]);
  const [comments, setComments] = useState([]);
  const [editOpen, setEditOpen] = useState(false);

  const [username, setUsername] = useState(user?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:5000/api/visits', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(data => setVisits(data));

    fetch('http://localhost:5000/api/mycomments', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(data => setComments(data));
  }, []);

  const handleUpdate = async () => {
    setMsg(null);
    setError(null);

    const body = {};
    if (username !== user.username) body.username = username;
    if (currentPassword && newPassword) {
      body.currentPassword = currentPassword;
      body.newPassword = newPassword;
    }

    if (Object.keys(body).length === 0) {
      setError("Nu ai modificat nimic!");
      return;
    }

    const res = await fetch('http://localhost:5000/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setMsg("Profil actualizat cu succes!");
      setCurrentPassword("");
      setNewPassword("");
    } else {
      setError(data.msg || "Eroare la actualizare!");
    }
  };

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
    <div className="flex flex-col items-center justify-center h-full overflow-y-auto bg-slate-950 p-6 gap-6">

      {!editOpen ? (
        // CARD PROFIL
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
              <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase">Username</p>
              <p className="text-white text-lg">{user.username}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase">Rol acces</p>
              <span className="inline-block mt-1 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold border border-indigo-500/20">
                {user.role.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="bg-slate-800 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black text-emerald-400">{visits.length}</p>
                <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Orașe vizitate</p>
              </div>
              <div className="bg-slate-800 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black text-indigo-400">{comments.length}</p>
                <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Comentarii</p>
              </div>
            </div>
            <button
              onClick={() => setEditOpen(true)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-2xl border border-slate-700 transition-all mt-2"
            >
              ✏️ Editează profilul
            </button>
          </div>
        </div>
      ) : (
        // CARD EDITARE
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl w-full max-w-md">
          <h2 className="text-2xl font-black text-white italic mb-6 border-b border-slate-800 pb-4">
            EDITEAZĂ PROFILUL
          </h2>

          {msg && <p className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 p-3 rounded-xl mb-4 text-sm">{msg}</p>}
          {error && <p className="bg-red-500/10 text-red-400 border border-red-500/20 p-3 rounded-xl mb-4 text-sm">{error}</p>}

          <div className="space-y-4">
            <div>
              <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mb-2">Username nou</p>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-800 text-white rounded-xl p-4 outline-none border border-slate-700 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mb-2">Parola curentă</p>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Lasă gol dacă nu schimbi parola"
                className="w-full bg-slate-800 text-white rounded-xl p-4 outline-none border border-slate-700 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mb-2">Parola nouă</p>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Lasă gol dacă nu schimbi parola"
                className="w-full bg-slate-800 text-white rounded-xl p-4 outline-none border border-slate-700 focus:border-indigo-500 transition-all"
              />
            </div>
            <button
              onClick={handleUpdate}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all"
            >
              Salvează modificările
            </button>
            <button
              onClick={() => { setEditOpen(false); setMsg(null); setError(null); }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl border border-slate-700 transition-all"
            >
              ← Înapoi la profil
            </button>
          </div>
        </div>
      )}

    </div>
  );
}