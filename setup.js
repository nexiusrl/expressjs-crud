const mysql = require('mysql2/promise');

async function setup() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
  });

  await conn.query('CREATE DATABASE IF NOT EXISTS crud_pegawai');
  await conn.query('USE crud_pegawai');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id       INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS pegawai (
      id      INT AUTO_INCREMENT PRIMARY KEY,
      nama    VARCHAR(150) NOT NULL,
      posisi  VARCHAR(100) NOT NULL,
      gaji    DECIMAL(15,2) NOT NULL,
      alamat  TEXT NOT NULL
    )
  `);

  console.log('✅ Database dan tabel berhasil dibuat!');
  await conn.end();
  process.exit(0);
}

setup().catch(err => {
  console.error('❌ Setup gagal:', err.message);
  process.exit(1);
});
