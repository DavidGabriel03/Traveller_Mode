export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-black italic mb-6 text-indigo-500">ADMIN PANEL</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-slate-400">Total Utilizatori</h3>
          <p className="text-3xl font-bold">124</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-slate-400">Destinații Adăugate</h3>
          <p className="text-3xl font-bold">45</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-slate-400">Recenzii Noi</h3>
          <p className="text-3xl font-bold">12</p>
        </div>
      </div>
    </div>
  );
}