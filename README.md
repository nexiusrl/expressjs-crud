# CRUD Pegawai

Aplikasi manajemen data pegawai berbasis web menggunakan **Express.js**, **EJS**, **Bootstrap 5**, dan **MySQL**.

## Fitur

- Register & Login admin
- Dashboard dengan total pegawai
- CRUD data pegawai (Tambah, Lihat, Edit, Hapus)
- Session-based authentication
- Password di-hash dengan bcrypt

## Tech Stack

| Layer | Teknologi |
|---|---|
| Backend | Node.js + Express.js |
| Template | EJS |
| Styling | Bootstrap 5 (CDN) |
| Database | MySQL (XAMPP/Laragon) |
| Auth | express-session + bcrypt |

## Struktur Kolom Pegawai

| Kolom | Tipe |
|---|---|
| id | INT (auto increment) |
| nama | VARCHAR(150) |
| posisi | VARCHAR(100) |
| gaji | DECIMAL(15,2) |
| alamat | TEXT |

## Instalasi

### 1. Clone & install dependencies

```bash
git clone <repo-url>
cd expressjs-crud
npm install
```

### 2. Pastikan MySQL aktif (XAMPP/Laragon), lalu setup database

```bash
npm run setup
```

> Otomatis membuat database `crud_pegawai` beserta tabel `users` dan `pegawai`.

### 3. Jalankan server

```bash
npm start
```

### 4. Buka browser

```
http://localhost:3000
```

## Struktur Project

```
web/
├── app.js              # Entry point
├── setup.js            # Auto setup database
├── config/
│   └── db.js           # MySQL connection pool
├── middleware/
│   └── auth.js         # Route protection
├── routes/
│   ├── auth.js         # Login, Register, Logout
│   └── pegawai.js      # CRUD pegawai
└── views/
    ├── login.ejs
    ├── register.ejs
    ├── dashboard.ejs
    └── pegawai/
        ├── index.ejs   # Tabel data
        ├── create.ejs  # Form tambah
        └── edit.ejs    # Form edit
```

## Konfigurasi Database

Default koneksi MySQL di `config/db.js`:

```js
host: 'localhost'
user: 'root'
password: ''
database: 'crud_pegawai'
```

Sesuaikan jika konfigurasi MySQL berbeda.
