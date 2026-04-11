import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [position, setPosition] = useState(null);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => setPosition([44.4268, 26.1025])
    );

    fetch("http://localhost:5000/api/cities")
      .then(res => res.json())
      .then(data => setCities(data))
      .catch(err => console.error("Eroare la cities:", err));
  }, []);

  if (!position) return <div className="p-20 text-white">Se încarcă harta...</div>;

  return (
    <div className="w-full h-full relative">
      <MapContainer center={[48, 15]} zoom={4} style={{ height: "100%", width: "100%" }}>
       <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        <Marker position={position}>
          <Popup>Ești aici! 📍</Popup>
        </Marker>

        {cities.map(city => (
          <Marker key={city.id} position={[city.latitude, city.longitude]}>
            <Popup>
              <div className="text-center">
                <img src={city.image} alt={city.name} className="w-32 h-20 object-cover rounded mb-2"/>
                <h3 className="font-bold text-slate-800">{city.name}</h3>
                <p className="text-xs text-slate-500 mb-2">{city.country}</p>
                <button
                  onClick={() => navigate(`/city/${city.id}`)}
                  className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-lg"
                >
                  Vezi detalii
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute top-4 right-4 z-[1000] bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700 text-white shadow-2xl">
        <h3 className="text-sm font-bold text-indigo-400 mb-1 uppercase tracking-widest">
          Capitale Europene
        </h3>
        <p className="text-2xl font-black">
          {cities.length}{" "}
          <span className="text-sm font-normal text-slate-400">orașe</span>
        </p>
      </div>
    </div>
  );
}