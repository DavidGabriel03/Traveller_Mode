import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cont creat! Acum te poți loga.");
        navigate("/login");
      } else {
        alert(data.msg || "Eroare la înregistrare");
      }
    } catch (err) {
      console.error(err);
      alert("Serverul nu răspunde!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-950">
      <div className="bg-slate-900 p-10 rounded-3xl shadow-2xl border border-slate-800 w-[400px]">
        <h2 className="text-3xl font-black text-white mb-8 italic">REGISTER</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nume utilizator"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 mb-4 rounded-xl bg-slate-800 text-white border border-slate-700 focus:border-indigo-500 outline-none transition-all"
            required
          />

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
            CREEAZĂ CONT
          </button>
        </form>
        
        <p className="text-slate-500 mt-6 text-center text-sm">
          Ai deja cont?{" "}
          <span 
            onClick={() => navigate("/login")} 
            className="text-indigo-400 cursor-pointer hover:underline"
          >
            Loghează-te
          </span>
        </p>
      </div>
    </div>
  );
}