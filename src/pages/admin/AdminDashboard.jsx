import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [cities, setCities] = useState([]);
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(data => setUsers(data));

    fetch('http://localhost:5000/api/admin/comments', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(data => setComments(data));

    fetch('http://localhost:5000/api/admin/cities', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(data => setCities(data));
    
    fetch('http://localhost:5000/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  const handleRoleChange = async (id, newRole) => {
    const res = await fetch(`http://localhost:5000/api/admin/users/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ role: newRole })
    });
    if (res.ok) setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const handleDelete = async (id) => {
    if (!confirm("Ești sigur că vrei să ștergi acest user?")) return;
    const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleDeleteComment = async (id) => {
    if (!confirm("Ștergi comentariul?")) return;
    const res = await fetch(`http://localhost:5000/api/comments/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setComments(prev => prev.filter(c => c.id !== id));
  };

  const handleStatsUpdate = async (id, stats) => {
    const res = await fetch(`http://localhost:5000/api/admin/cities/${id}/stats`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(stats)
    });
    if (res.ok) {
      const data = await res.json();
      setCities(prev => prev.map(c => c.id === id ? { ...c, ...stats, livability_score: data.livability_score } : c));
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-black text-indigo-400 mb-8">Admin Panel</h1>
      {/* Statistici generale */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Useri", value: stats.totalUsers, color: "text-indigo-400" },
            { label: "Orașe", value: stats.totalCities, color: "text-emerald-400" },
            { label: "Comentarii", value: stats.totalComments, color: "text-amber-400" },
            { label: "Vizite", value: stats.totalVisits, color: "text-pink-400" },
          ].map(s => (
            <div key={s.label} className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center">
              <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-slate-400 text-xs uppercase tracking-widest mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Top orașe vizitate */}
      {stats?.topCities?.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-black text-slate-300 mb-4 uppercase tracking-widest">Top orașe vizitate</h2>
          <div className="flex gap-4 flex-wrap">
            {stats.topCities.map((c, i) => (
              <div key={c.CityId} className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex items-center gap-3">
                <span className="text-2xl font-black text-indigo-400">#{i + 1}</span>
                <img src={c.City?.image} alt={c.City?.name} className="w-10 h-10 rounded-xl object-cover"/>
                <div>
                  <p className="font-bold text-white">{c.City?.name}</p>
                  <p className="text-slate-400 text-xs">{c.dataValues?.visits} vizite</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Management Useri */}
      <h2 className="text-xl font-black text-slate-300 mb-4 uppercase tracking-widest">Useri</h2>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden mb-10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left p-4 text-slate-400 text-xs uppercase tracking-widest">Username</th>
              <th className="text-left p-4 text-slate-400 text-xs uppercase tracking-widest">Email</th>
              <th className="text-left p-4 text-slate-400 text-xs uppercase tracking-widest">Rol</th>
              <th className="text-left p-4 text-slate-400 text-xs uppercase tracking-widest">Înregistrat</th>
              <th className="text-left p-4 text-slate-400 text-xs uppercase tracking-widest">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-all">
                <td className="p-4 font-bold">{u.username}</td>
                <td className="p-4 text-slate-400">{u.email}</td>
                <td className="p-4">
                  <select
                    value={u.role}
                    onChange={e => handleRoleChange(u.id, e.target.value)}
                    className="bg-slate-800 text-white rounded-lg px-3 py-1 text-sm border border-slate-700 outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-4 text-slate-400 text-sm">{new Date(u.createdAt).toLocaleDateString('ro-RO')}</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(u.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold px-3 py-2 rounded-xl transition-all">
                    Șterge
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Management Comentarii */}
      <h2 className="text-xl font-black text-slate-300 mb-4 uppercase tracking-widest">Comentarii</h2>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden mb-10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left p-4 text-slate-400 text-xs uppercase tracking-widest">User</th>
              <th className="text-left p-4 text-slate-400 text-xs uppercase tracking-widest">Oraș</th>
              <th className="text-left p-4 text-slate-400 text-xs uppercase tracking-widest">Comentariu</th>
              <th className="text-left p-4 text-slate-400 text-xs uppercase tracking-widest">Rating</th>
              <th className="text-left p-4 text-slate-400 text-xs uppercase tracking-widest">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {comments.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-slate-500">Niciun comentariu încă</td></tr>
            ) : (
              comments.map(c => (
                <tr key={c.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-all">
                  <td className="p-4 font-bold text-indigo-400">{c.User?.username}</td>
                  <td className="p-4 text-slate-300">{c.City?.name}</td>
                  <td className="p-4 text-slate-400 max-w-xs truncate">{c.text}</td>
                  <td className="p-4 text-amber-400">{"★".repeat(c.rating)}{"☆".repeat(5 - c.rating)}</td>
                  <td className="p-4">
                    <button onClick={() => handleDeleteComment(c.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold px-3 py-2 rounded-xl transition-all">
                      Șterge
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Management Statistici Orașe */}
      <h2 className="text-xl font-black text-slate-300 mb-4 uppercase tracking-widest">Statistici Orașe</h2>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left p-4 text-slate-400 text-xs uppercase tracking-widest">Oraș</th>
              <th className="text-left p-4 text-slate-400 text-xs uppercase tracking-widest">Turistic</th>
              <th className="text-left p-4 text-slate-400 text-xs uppercase tracking-widest">Siguranță</th>
              <th className="text-left p-4 text-slate-400 text-xs uppercase tracking-widest">Economic</th>
              <th className="text-left p-4 text-slate-400 text-xs uppercase tracking-widest">Locuibilitate</th>
              <th className="text-left p-4 text-slate-400 text-xs uppercase tracking-widest">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {cities.map(c => (
              <tr key={c.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-all">
                <td className="p-4 font-bold">{c.name}</td>
                {['tourism_rating', 'safety_rating', 'economy_rating'].map(field => (
                  <td key={field} className="p-4">
                    <select
                      value={c[field]}
                      onChange={e => setCities(prev => prev.map(city =>
                        city.id === c.id ? { ...city, [field]: parseFloat(e.target.value) } : city
                      ))}
                      className="bg-slate-800 text-white rounded-lg px-3 py-1 text-sm border border-slate-700 outline-none"
                    >
                      {[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </td>
                ))}
                <td className="p-4 text-indigo-400 font-bold">{Number(c.livability_score).toFixed(2)}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleStatsUpdate(c.id, {
                      tourism_rating: c.tourism_rating,
                      safety_rating: c.safety_rating,
                      economy_rating: c.economy_rating
                    })}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
                  >
                    Salvează
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}