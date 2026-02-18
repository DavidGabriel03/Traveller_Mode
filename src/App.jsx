import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Importăm noile pagini (asigură-te că drumul către fișiere e corect)
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";

export default function App() {
  return (
    <Router>
      <div className="flex h-screen w-screen bg-black overflow-hidden">
        {/* Sidebar-ul va fi vizibil pe toate paginile momentan */}
        <Sidebar />
        
        <main className="flex-1 h-full relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutele noi adăugate aici */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}