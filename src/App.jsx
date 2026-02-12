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

// Pagini
const Home = () => {
  const [position, setPosition] = useState(null); // Aici salvăm locația ta

  useEffect(() => {
    // Întrebăm browserul unde ești
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },
      (err) => {
        console.error("Eroare la geolocație:", err);
        // Dacă dai "Deny" sau e o eroare, punem București ca backup
        setPosition([44.4268, 26.1025]);
      }
    );
  }, []);

  // Până când browserul răspunde, afișăm un mesaj de încărcare
  if (!position) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 mr-4"></div>
        Căutăm coordonatele tale...
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* Markerul va fi acum exact unde ești tu */}
        <Marker position={position}>
          <Popup>Ești aici!</Popup>
        </Marker>
      </MapContainer>
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