import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function CityPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [city, setCity] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/cities/${id}`)
      .then(res => res.json())
      .then(data => setCity(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!city) return <div className="p-20 text-white">Se încarcă...</div>;

  return (
    <div className="h-full overflow-y-auto bg-slate-950 text-white">
     {/* Header fără poză mare */}
<div className="p-8 pb-0 flex items-center gap-4">
  <button
    onClick={() => navigate(-1)}
    className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm hover:bg-slate-700 transition-all"
  >
    ← Înapoi
  </button>
  <div className="flex items-center gap-4">
    <img src={city.image} alt={city.name} className="w-16 h-16 object-cover rounded-xl"/>
    <div>
      <h1 className="text-3xl font-black italic">{city.name}</h1>
      <p className="text-slate-400 text-sm uppercase tracking-widest">{city.country}</p>
    </div>
  </div>
</div>
      {/* Detalii */}
      <div className="p-8">
        <p className="text-slate-400 text-sm mb-2 uppercase tracking-widest">{city.country}</p>
        <p className="text-slate-300 text-lg leading-relaxed">{city.description}</p>

        {/* Comentarii - urmează */}
        <div className="mt-10">
          <h2 className="text-2xl font-black italic text-indigo-400 mb-4">Comentarii</h2>
          <p className="text-slate-500">Se lucrează...</p>
        </div>
      </div>
    </div>
  );
}