// URL-ul backend-ului. În producție (Vercel), setează VITE_API_URL
// în variabilele de mediu ale proiectului către URL-ul serviciului backend
// (ex. https://traveller-mode-backend.onrender.com).
// Local, dacă nu setezi nimic, rămâne pe localhost:5000.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
