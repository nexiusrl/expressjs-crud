const express = require('express');
const session = require('express-session');
const path = require('path');
const isAuthenticated = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const pegawaiRoutes = require('./routes/pegawai');

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'crud_pegawai_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 jam
}));

// Routes
app.get('/', (req, res) => res.redirect('/login'));
app.use('/', authRoutes);
app.get('/dashboard', isAuthenticated, async (req, res) => {
  const db = require('./config/db');
  const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM pegawai');
  res.render('dashboard', { user: req.session.user, total });
});
app.use('/pegawai', pegawaiRoutes);

// 404
app.use((req, res) => {
  res.status(404).send('<h2>404 - Halaman tidak ditemukan</h2><a href="/dashboard">Kembali</a>');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
