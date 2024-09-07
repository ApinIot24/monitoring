const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Inisialisasi Express
const app = express();
app.use(cors()); // Mengizinkan permintaan dari domain berbeda

// Koneksi ke PostgreSQL
const pool = new Pool({
  user: 'username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

// Endpoint untuk mendapatkan data
  app.get('/api/data', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM ');
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// Server listen di port 5000
app.listen(5000, () => {
  console.log('Server berjalan di port 5000');
});
