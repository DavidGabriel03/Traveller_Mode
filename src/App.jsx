import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// 1. IMPORTĂM Sidebar-ul (cel cu logică de login/logout) din fișierul lui
import Sidebar from "./components/Sidebar";

// 2. IMPORTĂM restul paginilor din folderele lor (nu le mai scriem aici!)
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/user/Profile";

// 3. PLACEHOLDERS pentru paginile care nu au încă un fișier separat
// Le dăm nume diferite față de importuri ca să nu crape
const AdminDashboard = () => (
  <div className="flex items-center justify-center h-full text-white">
    <h1 className="text-4xl font-black italic text-indigo-500 text-center">
      ADMIN PANEL <br/> <span className="text-sm text-slate-500 not-italic">Se lucrează aici...</span>
    </h1>
  </div>
);

const UserDashboard = () => (
  <div className="flex items-center justify-center h-full text-white">
    <h1 className="text-4xl font-black italic text-emerald-500 text-center">
      MY TRIPS <br/> <span className="text-sm text-slate-500 not-italic">Se lucrează aici...</span>
    </h1>
  </div>
);

// Aplicația principală
export default function App() {
  return (
    <Router>
      <div className="flex h-screen w-screen bg-black overflow-hidden">
        
        {/* Folosim componenta Sidebar importată */}
        <Sidebar />
        
        <main className="flex-1 h-full relative bg-slate-950">
          <Routes>
            {/* Paginile importate din folderul /pages */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutele noi care folosesc placeholderele de mai sus */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}