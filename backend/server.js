const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// CONEXIUNEA LA MYSQL ȘI SINCRONIZAREA MODELELOR
const sequelize = require('./db');
const User = require('./models/User');
const City = require('./models/City');

sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectat la MySQL!');
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log('✅ Tabele sincronizate!');
  })
  .catch(err => console.error('❌ Eroare la conexiune:', err));
app.get('/', (req, res) => res.send("Serverul și Baza de Date sunt legate!"));

// REGISTER
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    res.status(201).json({ msg: "Utilizator creat cu succes!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ msg: "Email incorect!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Parolă incorectă!" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret_cheie_test',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
// GET toate orașele
app.get('/api/cities', async (req, res) => {
  try {
    const cities = await City.findAll();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET un oraș după id
app.get('/api/cities/:id', async (req, res) => {
  try {
    const city = await City.findByPk(req.params.id);
    if (!city) return res.status(404).json({ msg: "Orașul nu există!" });
    res.json(city);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, () => console.log(`🚀 Server pe portul ${PORT}`));