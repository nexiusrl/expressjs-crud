const express = require('express');
const router = express.Router();
const db = require('../config/db');
const isAuthenticated = require('../middleware/auth');

// GET /pegawai - tabel semua pegawai
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pegawai ORDER BY id DESC');
    res.render('pegawai/index', { pegawai: rows, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

// GET /pegawai/create
router.get('/create', isAuthenticated, (req, res) => {
  res.render('pegawai/create', { error: null, user: req.session.user });
});

// POST /pegawai/create
router.post('/create', isAuthenticated, async (req, res) => {
  const { nama, posisi, gaji, alamat } = req.body;
  if (!nama || !posisi || !gaji || !alamat) {
    return res.render('pegawai/create', { error: 'Semua field wajib diisi.', user: req.session.user });
  }
  if (isNaN(gaji) || Number(gaji) <= 0) {
    return res.render('pegawai/create', { error: 'Gaji harus angka positif.', user: req.session.user });
  }
  try {
    await db.query('INSERT INTO pegawai (nama, posisi, gaji, alamat) VALUES (?, ?, ?, ?)', [nama, posisi, gaji, alamat]);
    res.redirect('/pegawai');
  } catch (err) {
    console.error(err);
    res.render('pegawai/create', { error: 'Gagal menyimpan data.', user: req.session.user });
  }
});

// GET /pegawai/edit/:id
router.get('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pegawai WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.redirect('/pegawai');
    res.render('pegawai/edit', { data: rows[0], error: null, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.redirect('/pegawai');
  }
});

// POST /pegawai/edit/:id
router.post('/edit/:id', isAuthenticated, async (req, res) => {
  const { nama, posisi, gaji, alamat } = req.body;
  if (!nama || !posisi || !gaji || !alamat) {
    const [rows] = await db.query('SELECT * FROM pegawai WHERE id = ?', [req.params.id]);
    return res.render('pegawai/edit', { data: rows[0], error: 'Semua field wajib diisi.', user: req.session.user });
  }
  if (isNaN(gaji) || Number(gaji) <= 0) {
    const [rows] = await db.query('SELECT * FROM pegawai WHERE id = ?', [req.params.id]);
    return res.render('pegawai/edit', { data: rows[0], error: 'Gaji harus angka positif.', user: req.session.user });
  }
  try {
    await db.query('UPDATE pegawai SET nama=?, posisi=?, gaji=?, alamat=? WHERE id=?', [nama, posisi, gaji, alamat, req.params.id]);
    res.redirect('/pegawai');
  } catch (err) {
    console.error(err);
    res.redirect('/pegawai');
  }
});

// POST /pegawai/delete/:id
router.post('/delete/:id', isAuthenticated, async (req, res) => {
  try {
    await db.query('DELETE FROM pegawai WHERE id = ?', [req.params.id]);
    res.redirect('/pegawai');
  } catch (err) {
    console.error(err);
    res.redirect('/pegawai');
  }
});

module.exports = router;
