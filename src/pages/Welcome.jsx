import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto bg-slate-950 text-white">
      {/* Hero */}
      <div className="relative flex flex-col items-center justify-center h-screen text-center px-8"
        style={{
          background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 60%)'
        }}
      >
        <p className="text-indigo-400 text-sm uppercase tracking-widest mb-4 font-bold">
          Explorează Europa
        </p>
        <h1 className="text-7xl font-black italic text-white mb-6 leading-none">
          TRAVELLER
        </h1>
        <p className="text-slate-400 text-xl max-w-lg mb-10 leading-relaxed">
          Descoperă capitalele Europei, lasă comentarii și ține evidența orașelor vizitate.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/register')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-indigo-500/20"
          >
            Începe acum
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all border border-slate-700"
          >
            Login
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2 text-slate-500">
          <p className="text-xs uppercase tracking-widest">Scroll pentru mai mult</p>
          <div className="w-0.5 h-8 bg-slate-700 rounded-full"/>
        </div>
      </div>

      {/* Features */}
      <div className="px-8 py-24 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black italic text-center text-white mb-16">
          Ce poți face în Traveller?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🗺️",
              title: "Hartă interactivă",
              desc: "Explorează toate capitalele Uniunii Europene pe o hartă interactivă cu informații detaliate."
            },
            {
              icon: "⭐",
              title: "Statistici & Ratings",
              desc: "Vezi statistici despre fiecare oraș — turism, siguranță, economie și locuibilitate."
            },
            {
              icon: "✈️",
              title: "Jurnal de călătorie",
              desc: "Marchează orașele vizitate și ține evidența călătoriilor tale în secțiunea My Travels."
            },
          ].map(f => (
            <div key={f.title} className="bg-slate-900 rounded-3xl p-8 border border-slate-800 text-center hover:border-indigo-500/50 transition-all">
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-black text-white mb-3">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pb-24 px-8">
        <h2 className="text-3xl font-black italic text-white mb-4">Gata să explorezi?</h2>
        <p className="text-slate-400 mb-8">Creează un cont gratuit și începe aventura.</p>
        <button
          onClick={() => navigate('/register')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-indigo-500/20"
        >
          Creează cont
        </button>
      </div>
    </div>
  );
}