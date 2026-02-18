import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // --- Aici se întâmplă salvarea despre care vorbeam ---
        localStorage.setItem("token", data.token); 
        localStorage.setItem("user", JSON.stringify(data.user)); 

        // Redirecționare în funcție de rolul primit de la server
        if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        alert(data.msg || "Date incorecte!");
      }
    } catch (err) {
      console.error("Eroare la logare:", err);
      alert("Serverul nu răspunde!");
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-slate-950">
      <div className="bg-slate-900 p-10 rounded-3xl shadow-2xl border border-slate-800 w-[400px]">
        <h2 className="text-3xl font-black text-white mb-8 italic">LOGIN</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 mb-4 rounded-xl bg-slate-800 text-white border border-slate-700 focus:border-indigo-500 outline-none transition-all"
            required
          />

          <input
            type="password"
            placeholder="Parolă"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 mb-8 rounded-xl bg-slate-800 text-white border border-slate-700 focus:border-indigo-500 outline-none transition-all"
            required
          />

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
          >
            SĂ MERGEM!
          </button>
        </form>
        
        <p className="text-slate-500 mt-6 text-center text-sm">
          Nu ai cont?{" "}
          <span 
            onClick={() => navigate("/register")} 
            className="text-indigo-400 cursor-pointer hover:underline"
          >
            Înregistrează-te
          </span>
        </p>
      </div>
    </div>
  );
}