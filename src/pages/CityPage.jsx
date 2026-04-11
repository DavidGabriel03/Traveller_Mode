import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function CityPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [city, setCity] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoTab, setPhotoTab] = useState('url');
  const [photoCaption, setPhotoCaption] = useState("");

  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));

  const [visited, setVisited] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/visits", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const alreadyVisited = data.some((v) => v.CityId === parseInt(id));
        setVisited(alreadyVisited);
      });
  }, [id]);

  const handleVisit = async () => {
    if (visited) {
      const res = await fetch(
        `http://localhost:5000/api/visits/${parseInt(id)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) setVisited(false);
    } else {
      const res = await fetch("http://localhost:5000/api/visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ CityId: parseInt(id) }),
      });
      if (res.ok) setVisited(true);
    }
  };

  const handleDelete = async (commentId) => {
    const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };
  const handleAddPhoto = async () => {
    if (!photoUrl.trim()) return;

    const res = await fetch(`http://localhost:5000/api/cities/${id}/photos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url: photoUrl, caption: photoCaption }),
    });

    if (res.ok) {
      const newPhoto = await res.json();
      setPhotos((prev) => [newPhoto, ...prev]);
      setPhotoUrl("");
      setPhotoCaption("");
    }
  };

  const handleDeletePhoto = async (photoId) => {
    const res = await fetch(`http://localhost:5000/api/photos/${photoId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  useEffect(() => {
    fetch(`http://localhost:5000/api/cities/${id}`)
      .then((res) => res.json())
      .then((data) => setCity(data));

    fetch(`http://localhost:5000/api/cities/${id}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data));
    fetch(`http://localhost:5000/api/cities/${id}/photos`)
      .then((res) => res.json())
      .then((data) => setPhotos(data));
  }, [id]);

  const handleComment = async () => {
    if (!text.trim()) return;

    const res = await fetch(`http://localhost:5000/api/cities/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text, rating }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setText("");
      setRating(5);
      // Reîncarcă orașul pentru livability_score actualizat
      fetch(`http://localhost:5000/api/cities/${id}`)
        .then((r) => r.json())
        .then((data) => setCity(data));
    }
  };

  if (!city) return <div className="p-20 text-white">Se încarcă...</div>;

  return (
    <div className="h-full overflow-y-auto bg-slate-950 text-white">
      {/* Header */}
      <div className="p-8 pb-0 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm hover:bg-slate-700 transition-all"
        >
          ← Înapoi
        </button>
        <button
          onClick={handleVisit}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            visited
              ? "bg-emerald-500/20 text-emerald-400 hover:bg-red-500/20 hover:text-red-400"
              : "bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400"
          }`}
        >
          {visited ? "✓ Vizitat — click să deselectezi" : "+ Marchează vizitat"}
        </button>
        <div className="flex items-center gap-4">
          <img
            src={city.image}
            alt={city.name}
            className="w-16 h-16 object-cover rounded-xl"
          />
          <div>
            <h1 className="text-3xl font-black italic">{city.name}</h1>
            <p className="text-slate-400 text-sm uppercase tracking-widest">
              {city.country}
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Statistici */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Turistic", value: city.tourism_rating },
            { label: "Siguranță", value: city.safety_rating },
            { label: "Economic", value: city.economy_rating },
            { label: "Locuibil", value: city.livability_score },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-center"
            >
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-black text-indigo-400">
                {Number(stat.value).toFixed(1)}
              </p>
              <p className="text-slate-500 text-xs">/ 5.0</p>
            </div>
          ))}
        </div>

        <p className="text-slate-300 text-lg leading-relaxed mb-10">
          {city.description}
        </p>

        {/* Comentarii */}
        <h2 className="text-2xl font-black italic text-indigo-400 mb-6">
          Comentarii
        </h2>

        {/* Formular */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-8">
          <p className="text-slate-400 text-sm mb-3">Rating:</p>
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="text-2xl transition-all"
              >
                {star <= (hover || rating) ? "★" : "☆"}
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Scrie un comentariu..."
            className="w-full bg-slate-800 text-white rounded-xl p-4 outline-none border border-slate-700 focus:border-indigo-500 transition-all resize-none h-24 mb-4"
          />
          <button
            onClick={handleComment}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-all"
          >
            Trimite
          </button>
        </div>

        {/* Lista comentarii */}
        <div className="flex flex-col gap-4">
          {comments.length === 0 && (
            <p className="text-slate-500 text-center">
              Niciun comentariu încă. Fii primul!
            </p>
          )}
          {comments.map((c) => (
            <div
              key={c.id}
              className="bg-slate-900 rounded-2xl p-5 border border-slate-800"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-indigo-400">
                  {c.User?.username || "Anonim"}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-amber-400">
                    {"★".repeat(c.rating)}
                    {"☆".repeat(5 - c.rating)}
                  </span>
                  {(user?.id === c.UserId || user?.role === "admin") && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-500 hover:text-red-400 text-xs font-bold transition-all"
                    >
                      Șterge
                    </button>
                  )}
                </div>
              </div>
              <p className="text-slate-300">{c.text}</p>
            </div>
          ))}
        </div>
        {/* Galerie foto */}
<h2 className="text-2xl font-black italic text-indigo-400 mb-6 mt-10">Galerie foto</h2>
<div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-8">
  
  {/* Tabs URL / Upload */}
  <div className="flex gap-2 mb-4">
    <button
      onClick={() => setPhotoTab('url')}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
        photoTab === 'url' 
          ? 'bg-indigo-600 text-white' 
          : 'bg-slate-800 text-slate-400 hover:text-white'
      }`}
    >
      URL
    </button>
    <button
      onClick={() => setPhotoTab('upload')}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
        photoTab === 'upload' 
          ? 'bg-indigo-600 text-white' 
          : 'bg-slate-800 text-slate-400 hover:text-white'
      }`}
    >
      Încarcă fișier
    </button>
  </div>

  {photoTab === 'url' ? (
    <input
      type="text"
      value={photoUrl}
      onChange={e => setPhotoUrl(e.target.value)}
      placeholder="URL poza..."
      className="w-full bg-slate-800 text-white rounded-xl p-4 outline-none border border-slate-700 focus:border-indigo-500 transition-all mb-3"
    />
  ) : (
    <input
      type="file"
      accept="image/*"
      onChange={async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('photo', file);
        const res = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          setPhotoUrl(data.url);
        }
      }}
      className="w-full bg-slate-800 text-white rounded-xl p-4 outline-none border border-slate-700 transition-all mb-3"
    />
  )}

  <input
    type="text"
    value={photoCaption}
    onChange={e => setPhotoCaption(e.target.value)}
    placeholder="Descriere (opțional)..."
    className="w-full bg-slate-800 text-white rounded-xl p-4 outline-none border border-slate-700 focus:border-indigo-500 transition-all mb-4"
  />
  <button
    onClick={handleAddPhoto}
    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-all"
  >
    Adaugă poză
  </button>
</div>
        {/* Grid galerie */}
        {photos.length === 0 ? (
          <p className="text-slate-500 text-center">
            Nicio poză adăugată încă. Fii primul!
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((p) => (
              <div
                key={p.id}
                className="relative group rounded-2xl overflow-hidden"
              >
                <img
                  src={p.url}
                  alt={p.caption || ""}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-3">
                  {p.caption && (
                    <p className="text-white text-sm mb-2">{p.caption}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-xs">
                      {p.User?.username}
                    </span>
                    {(user?.id === p.UserId || user?.role === "admin") && (
                      <button
                        onClick={() => handleDeletePhoto(p.id)}
                        className="text-red-400 text-xs font-bold hover:text-red-300"
                      >
                        Șterge
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
