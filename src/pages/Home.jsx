import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";

function ClickHandler({ setMarkers }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const name = prompt("Cum se numește acest loc?");
      if (name) {
        setMarkers(prev => [...prev, { lat, lng, name, id: Date.now() }]);
      }
    },
  });
  return null;
}

export default function Home() {
  const [position, setPosition] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => setPosition([44.4268, 26.1025])
    );
  }, []);

  if (!position) return <div className="p-20 text-white">Se încarcă harta...</div>;

  return (
    <div className="w-full h-full relative">
      <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <ClickHandler setMarkers={setMarkers} />

        <Marker position={position}>
          <Popup>Ești aici! 📍</Popup>
        </Marker>

        {markers.map(m => (
          <Marker key={m.id} position={[m.lat, m.lng]}>
            <Popup className="font-bold text-indigo-600">{m.name}</Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute top-4 right-4 z-[1000] bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700 text-white shadow-2xl">
        <h3 className="text-sm font-bold text-indigo-400 mb-1 uppercase tracking-widest">
          Jurnal de călătorie
        </h3>
        <p className="text-2xl font-black">
          {markers.length}{" "}
          <span className="text-sm font-normal text-slate-400">locuri vizitate</span>
        </p>
      </div>
    </div>
  );
}
