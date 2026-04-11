import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CitiesPage() {
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("toate");
  const [filterRating, setFilterRating] = useState("toate");
  const [sortBy, setSortBy] = useState("name");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/cities")
      .then(res => res.json())
      .then(data => setCities(data));
  }, []);

  const countries = ["toate", ...new Set(cities.map(c => c.country))];

  const filtered = cities
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .filter(c => filterCountry === "toate" || c.country === filterCountry)
    .filter(c => {
      if (filterRating === "toate") return true;
      if (filterRating === "4+") return c.livability_score >= 4;
      if (filterRating === "3+") return c.livability_score >= 3;
      if (filterRating === "2+") return c.livability_score >= 2;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "rating") return b.livability_score - a.livability_score;
      if (sortBy === "tourism") return b.tourism_rating - a.tourism_rating;
      if (sortBy === "safety") return b.safety_rating - a.safety_rating;
      return 0;
    });

  return (
    <div className="h-full overflow-y-auto bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-black italic text-indigo-400 mb-8">Orașe</h1>

      {/* Filtre */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Caută oraș..."
          className="bg-slate-900 text-white rounded-xl p-3 outline-none border border-slate-700 focus:border-indigo-500 transition-all"
        />
        <select
          value={filterCountry}
          onChange={e => setFilterCountry(e.target.value)}
          className="bg-slate-900 text-white rounded-xl p-3 outline-none border border-slate-700 outline-none"
        >
          {countries.map(c => (
            <option key={c} value={c}>{c === "toate" ? "Toate țările" : c}</option>
          ))}
        </select>
        <select
          value={filterRating}
          onChange={e => setFilterRating(e.target.value)}
          className="bg-slate-900 text-white rounded-xl p-3 outline-none border border-slate-700"
        >
          <option value="toate">Orice rating</option>
          <option value="2+">Rating 2+</option>
          <option value="3+">Rating 3+</option>
          <option value="4+">Rating 4+</option>
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-slate-900 text-white rounded-xl p-3 outline-none border border-slate-700"
        >
          <option value="name">Sortare: Nume</option>
          <option value="rating">Sortare: Locuibilitate</option>
          <option value="tourism">Sortare: Turism</option>
          <option value="safety">Sortare: Siguranță</option>
        </select>
      </div>

      {/* Rezultate */}
      <p className="text-slate-500 text-sm mb-4">{filtered.length} orașe găsite</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(city => (
          <div
            key={city.id}
            className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-indigo-500/50 transition-all cursor-pointer"
            onClick={() => navigate(`/city/${city.id}`)}
          >
            <img src={city.image} alt={city.name} className="w-full h-40 object-cover"/>
            <div className="p-5">
              <h3 className="font-black text-lg">{city.name}</h3>
              <p className="text-slate-400 text-sm mb-3">{city.country}</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Turism", value: city.tourism_rating },
                  { label: "Siguranță", value: city.safety_rating },
                  { label: "Economic", value: city.economy_rating },
                  { label: "Locuibilitate", value: city.livability_score },
                ].map(s => (
                  <div key={s.label} className="bg-slate-800 rounded-xl p-2 text-center">
                    <p className="text-slate-400 text-[10px] uppercase tracking-widest">{s.label}</p>
                    <p className="text-indigo-400 font-black">{Number(s.value).toFixed(1)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}