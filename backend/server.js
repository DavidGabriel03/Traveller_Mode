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
const Comment = require('./models/Comment');
const Visit = require('./models/Visit');

// Relații
User.hasMany(Comment, { foreignKey: 'UserId' });
Comment.belongsTo(User, { foreignKey: 'UserId' });
City.hasMany(Comment, { foreignKey: 'CityId' });
Comment.belongsTo(City, { foreignKey: 'CityId' });
User.hasMany(Visit, { foreignKey: 'UserId' });
Visit.belongsTo(User, { foreignKey: 'UserId' });
City.hasMany(Visit, { foreignKey: 'CityId' });
Visit.belongsTo(City, { foreignKey: 'CityId' });

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
     user: { id: user.id, username: user.username, email: user.email, role: user.role }
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

// POST comentariu nou
app.post('/api/cities/:id/comments', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: "Neautorizat!" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_cheie_test');
    
    const { text, rating } = req.body;
    const comment = await Comment.create({
      text,
      rating,
      UserId: decoded.id,
      CityId: req.params.id
    });

    // Recalculăm livability_score
    const comments = await Comment.findAll({ where: { CityId: req.params.id } });
    const avgRating = comments.reduce((sum, c) => sum + c.rating, 0) / comments.length;
    const city = await City.findByPk(req.params.id);
    const livability = ((city.tourism_rating + city.safety_rating + city.economy_rating + avgRating) / 4).toFixed(2);
    await city.update({ livability_score: livability });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET comentarii oraș
app.get('/api/cities/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.findAll({ 
      where: { CityId: req.params.id },
      include: [{ model: User, attributes: ['username'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE comentariu
app.delete('/api/comments/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: "Neautorizat!" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_cheie_test');
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) return res.status(404).json({ msg: "Comentariul nu există!" });

    // Verificăm dacă e autorul sau adminul
    if (comment.UserId !== decoded.id && decoded.role !== 'admin') {
      return res.status(403).json({ msg: "Nu ai permisiunea să ștergi acest comentariu!" });
    }

    await comment.destroy();
    res.json({ msg: "Comentariu șters!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Marchează un oraș ca vizitat
app.post('/api/visits', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: "Neautorizat!" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_cheie_test');
    const { CityId } = req.body;

    // Verificăm să nu existe deja
    const existing = await Visit.findOne({ where: { UserId: decoded.id, CityId } });
    if (existing) return res.status(400).json({ msg: "Orașul e deja marcat ca vizitat!" });

    const visit = await Visit.create({ UserId: decoded.id, CityId });
    res.status(201).json(visit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET vizitele unui user
app.get('/api/visits', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: "Neautorizat!" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_cheie_test');

    const visits = await Visit.findAll({
      where: { UserId: decoded.id },
      include: [{ model: City, attributes: ['id', 'name', 'country', 'image'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json(visits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE vizită
app.delete('/api/visits/:cityId', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: "Neautorizat!" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_cheie_test');

    await Visit.destroy({ where: { UserId: decoded.id, CityId: req.params.cityId } });
    res.json({ msg: "Vizită ștearsă!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/mycomments', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: "Neautorizat!" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_cheie_test');
    const comments = await Comment.findAll({ where: { UserId: decoded.id } });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET toți userii
app.get('/api/admin/users', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_cheie_test');
    if (decoded.role !== 'admin') return res.status(403).json({ msg: "Acces interzis!" });

    const users = await User.findAll({ attributes: ['id', 'username', 'email', 'role', 'createdAt'] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SCHIMBĂ rolul unui user
app.put('/api/admin/users/:id/role', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_cheie_test');
    if (decoded.role !== 'admin') return res.status(403).json({ msg: "Acces interzis!" });

    const { role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ msg: "Userul nu există!" });

    await user.update({ role });
    res.json({ msg: "Rol actualizat!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user
app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_cheie_test');
    if (decoded.role !== 'admin') return res.status(403).json({ msg: "Acces interzis!" });

    if (decoded.id === parseInt(req.params.id)) 
      return res.status(400).json({ msg: "Nu te poți șterge pe tine însuți!" });

    await User.destroy({ where: { id: req.params.id } });
    res.json({ msg: "User șters!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET toate comentariile
app.get('/api/admin/comments', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_cheie_test');
    if (decoded.role !== 'admin') return res.status(403).json({ msg: "Acces interzis!" });

    const comments = await Comment.findAll({
      include: [
        { model: User, attributes: ['username'] },
        { model: City, attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// UPDATE statistici oraș
app.put('/api/admin/cities/:id/stats', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_cheie_test');
    if (decoded.role !== 'admin') return res.status(403).json({ msg: "Acces interzis!" });

    const { tourism_rating, safety_rating, economy_rating } = req.body;
    const city = await City.findByPk(req.params.id);
    if (!city) return res.status(404).json({ msg: "Orașul nu există!" });

    // Calculăm livability_score din cele 3 + media comentariilor
    const comments = await Comment.findAll({ where: { CityId: req.params.id } });
    const avgComments = comments.length > 0 
      ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length 
      : 0;
    
    const livability = (
      (parseFloat(tourism_rating) + parseFloat(safety_rating) + parseFloat(economy_rating) + avgComments) / 4
    ).toFixed(2);

    await city.update({ tourism_rating, safety_rating, economy_rating, livability_score: livability });
    res.json({ msg: "Statistici actualizate!", livability_score: livability });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET toate orașele pentru admin
app.get('/api/admin/cities', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_cheie_test');
    if (decoded.role !== 'admin') return res.status(403).json({ msg: "Acces interzis!" });

    const cities = await City.findAll({ 
      attributes: ['id', 'name', 'country', 'tourism_rating', 'safety_rating', 'economy_rating', 'livability_score'] 
    });
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, () => console.log(`🚀 Server pe portul ${PORT}`));