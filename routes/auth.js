const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

// GET /login
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('login', { error: null });
});

// POST /login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.render('login', { error: 'Username tidak ditemukan.' });
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('login', { error: 'Password salah.' });
    }
    req.session.user = { id: user.id, username: user.username };
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Terjadi kesalahan server.' });
  }
});

// GET /register
router.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('register', { error: null });
});

// POST /register
router.post('/register', async (req, res) => {
  const { username, password, confirm_password } = req.body;
  if (!username || !password || !confirm_password) {
    return res.render('register', { error: 'Semua field wajib diisi.' });
  }
  if (password.length < 6) {
    return res.render('register', { error: 'Password minimal 6 karakter.' });
  }
  if (password !== confirm_password) {
    return res.render('register', { error: 'Konfirmasi password tidak cocok.' });
  }
  try {
    const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.render('register', { error: 'Username sudah digunakan.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Terjadi kesalahan server.' });
  }
});

// GET /logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
