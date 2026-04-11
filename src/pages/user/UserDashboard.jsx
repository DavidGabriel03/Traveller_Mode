import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const [visits, setVisits] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/visits', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setVisits(data));
  }, []);

  const handleRemove = async (cityId) => {
    const res = await fetch(`http://localhost:5000/api/visits/${cityId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setVisits(prev => prev.filter(v => v.CityId !== cityId));
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-black italic text-emerald-400 mb-8">My Travels</h1>

      {visits.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500">
          <p className="text-xl mb-2">Niciun oraș vizitat încă</p>
          <p className="text-sm">Explorează harta și marchează orașele vizitate!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visits.map(v => (
            <div key={v.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <img 
                src={v.City?.image} 
                alt={v.City?.name} 
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-black text-lg">{v.City?.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{v.City?.country}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/city/${v.CityId}`)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2 rounded-xl transition-all"
                  >
                    Vezi detalii
                  </button>
                  <button
                    onClick={() => handleRemove(v.CityId)}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm px-3 py-2 rounded-xl transition-all"
                  >
                    Șterge
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}