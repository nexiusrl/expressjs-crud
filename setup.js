const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setup() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASS || '';
  const database = process.env.DB_NAME || 'crud_pegawai';
  const port = process.env.DB_PORT || 3306;

  console.log('🔄 Menghubungkan ke server MySQL...');
  const conn = await mysql.createConnection({
    host,
    user,
    password,
    port: parseInt(port, 10),
  });

  console.log(`🔄 Membuat database "${database}" jika belum ada...`);
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
  await conn.query(`USE \`${database}\``);

  console.log('🔄 Membuat tabel "users" jika belum ada...');
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id       INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )
  `);

  console.log('🔄 Membuat tabel "pegawai" jika belum ada...');
  await conn.query(`
    CREATE TABLE IF NOT EXISTS pegawai (
      id      INT AUTO_INCREMENT PRIMARY KEY,
      nama    VARCHAR(150) NOT NULL,
      posisi  VARCHAR(100) NOT NULL,
      gaji    DECIMAL(15,2) NOT NULL,
      alamat  TEXT NOT NULL
    )
  `);

  console.log('✅ Database dan tabel berhasil diinisialisasi!');

  // Cek apakah ada flag --seed untuk menjalankan seeder
  const shouldSeed = process.argv.includes('--seed');
  if (shouldSeed) {
    console.log('🌱 Menjalankan seeder...');

    // 1. Seed Users
    const [users] = await conn.query('SELECT * FROM users WHERE username = ?', ['admin']);
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    if (users.length === 0) {
      console.log('👥 Mengisi data default user...');
      await conn.query('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
      console.log('✅ Default user berhasil ditambahkan (Username: admin, Password: admin123)');
    } else {
      console.log('🔄 Memperbarui password default user...');
      await conn.query('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, 'admin']);
      console.log('✅ Password default user berhasil diperbarui menjadi: admin123');
    }

    // 2. Seed Pegawai
    const [pegawai] = await conn.query('SELECT COUNT(*) AS count FROM pegawai');
    if (pegawai[0].count === 0) {
      console.log('💼 Mengisi data default pegawai...');
      const defaultPegawai = [
        ['Budi Santoso', 'Software Engineer', 15000000.00, 'Jl. Sudirman No. 12, Jakarta'],
        ['Siti Aminah', 'Project Manager', 18000000.00, 'Jl. Gatot Subroto No. 45, Bandung'],
        ['Joko Widodo', 'UI/UX Designer', 12000000.00, 'Jl. Diponegoro No. 8, Yogyakarta'],
        ['Dewi Lestari', 'Quality Assurance', 10000000.00, 'Jl. Pemuda No. 101, Semarang'],
        ['Rian Hidayat', 'DevOps Engineer', 14500000.00, 'Jl. Ahmad Yani No. 56, Surabaya']
      ];

      for (const p of defaultPegawai) {
        await conn.query(
          'INSERT INTO pegawai (nama, posisi, gaji, alamat) VALUES (?, ?, ?, ?)',
          p
        );
      }
      console.log('✅ Data default pegawai berhasil ditambahkan!');
    } else {
      console.log('ℹ️ Tabel "pegawai" sudah berisi data. Seeder dilewati.');
    }
  }

  await conn.end();
  process.exit(0);
}

setup().catch(err => {
  console.error('❌ Setup gagal:', err.message);
  process.exit(1);
});
