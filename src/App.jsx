import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';

// Componenta Sidebar inclusă aici ca să nu mai avem erori de import
const Sidebar = () => (
  <div className="w-64 h-full bg-slate-900 text-white flex flex-col p-6 shadow-2xl border-r border-slate-800 z-[1000]">
    <h2 className="text-2xl font-black mb-10 text-indigo-500 italic tracking-tighter uppercase">Traveller</h2>
    <nav className="flex flex-col gap-4">
      <Link to="/" className="hover:bg-slate-800 p-3 rounded-lg transition-all border border-transparent hover:border-slate-700 font-medium"> Explorator</Link>
      <Link to="/login" className="hover:bg-slate-800 p-3 rounded-lg transition-all border border-transparent hover:border-slate-700 font-medium"> Autentificare</Link>
      <Link to="/register" className="hover:bg-slate-800 p-3 rounded-lg transition-all border border-transparent hover:border-slate-700 font-medium"> Înregistrare</Link>
    </nav>
  </div>
);
function ClickHandler({ setMarkers }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const name = prompt("Cum se numește acest loc?"); // O metodă rapidă de a da nume
      if (name) {
        setMarkers(prev => [...prev, { lat, lng, name, id: Date.now() }]);
      }
    },
  });
  return null;
}
// Pagini
const Home = () => {
  const [position, setPosition] = useState(null);
  const [markers, setMarkers] = useState([]); // Aici ținem lista de locuri salvate

  // ... (păstrăm useEffect-ul de geolocație de mai devreme)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => setPosition([44.4268, 26.1025])
    );
  }, []);

  if (!position) return <div className="p-20 text-white">Se încarcă harta...</div>;

  return (
    <div className="w-full h-full relative">
      <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* Activăm ascultătorul de click-uri */}
        <ClickHandler setMarkers={setMarkers} />

        {/* Afișăm markerul cu locația ta */}
        <Marker position={position}>
          <Popup>Ești aici! 📍</Popup>
        </Marker>

        {/* Afișăm toate locurile pe care ai dat click */}
        {markers.map(m => (
          <Marker key={m.id} position={[m.lat, m.lng]}>
            <Popup className="font-bold text-indigo-600">{m.name}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Mic panou de statistici în colțul hărții */}
      <div className="absolute top-4 right-4 z-[1000] bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700 text-white shadow-2xl">
        <h3 className="text-sm font-bold text-indigo-400 mb-1 uppercase tracking-widest">Jurnal de călătorie</h3>
        <p className="text-2xl font-black">{markers.length} <span className="text-sm font-normal text-slate-400">locuri vizitate</span></p>
      </div>
    </div>
  );
};
const Login = () => (
  <div className="flex items-center justify-center h-full bg-slate-950">
    <div className="bg-slate-900 p-10 rounded-3xl shadow-2xl border border-slate-800 w-[400px]">
      <h2 className="text-3xl font-black text-white mb-8 italic">LOGIN</h2>
      <input type="email" placeholder="Email" className="w-full p-4 mb-4 rounded-xl bg-slate-800 text-white border border-slate-700 focus:border-indigo-500 outline-none transition-all" />
      <input type="password" placeholder="Parolă" className="w-full p-4 mb-8 rounded-xl bg-slate-800 text-white border border-slate-700 focus:border-indigo-500 outline-none transition-all" />
      <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all">
        SĂ MERGEM!
      </button>
    </div>
  </div>
);

const Register = () => (
  <div className="flex items-center justify-center h-full bg-slate-950 text-white">
    <h2 className="text-3xl font-bold">Pagina de Register 📝</h2>
  </div>
);

// Aplicația principală
export default function App() {
  return (
    <Router>
      <div className="flex h-screen w-screen bg-black overflow-hidden">
        <Sidebar />
        <main className="flex-1 h-full relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}