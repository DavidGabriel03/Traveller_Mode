const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// CONEXIUNEA LA MONGODB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Conectat la MongoDB!"))
    .catch(err => console.error("❌ Eroare la conexiune:", err));

app.get('/', (req, res) => res.send("Serverul și Baza de Date sunt legate!"));

const User = require('./models/User');

const bcrypt = require('bcryptjs');

app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // 1. Criptăm parola
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Salvăm user-ul cu parola criptată
    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword, 
      role: role || 'user' 
    });
    
    await newUser.save();
    res.status(201).json({ msg: "Utilizator creat cu succes!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const jwt = require('jsonwebtoken');

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Verificăm dacă user-ul există
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Email incorect!" });

    // 2. Comparăm parola introdusă cu cea criptată din DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Parolă incorectă!" });

    // 3. Creăm Token-ul (Biletul de acces)
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'secret_cheie_test', 
      { expiresIn: '1d' } // Tokenul expiră în 24h
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server pe portul ${PORT}`));