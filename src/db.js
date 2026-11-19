const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}

const libroRepository = {
  async findAll() {
    const [rows] = await getPool().execute('SELECT id, titulo, autor, anio_publicacion FROM libros');
    return rows;
  },
  async findById(id) {
    const [rows] = await getPool().execute('SELECT id, titulo, autor, anio_publicacion FROM libros WHERE id = ?', [id]);
    return rows[0] || null;
  },
  async create({ titulo, autor, anio_publicacion }) {
    const [result] = await getPool().execute(
      'INSERT INTO libros (titulo, autor, anio_publicacion) VALUES (?, ?, ?)',
      [titulo.trim(), autor.trim(), anio_publicacion]
    );
    return { id: result.insertId, titulo: titulo.trim(), autor: autor.trim(), anio_publicacion };
  },
  async update(id, { titulo, autor, anio_publicacion }) {
    const [result] = await getPool().execute(
      'UPDATE libros SET titulo = ?, autor = ?, anio_publicacion = ? WHERE id = ?',
      [titulo.trim(), autor.trim(), anio_publicacion, id]
    );
    if (result.affectedRows === 0) return null;
    return { id: Number(id), titulo: titulo.trim(), autor: autor.trim(), anio_publicacion };
  },
  async remove(id) {
    const [result] = await getPool().execute('DELETE FROM libros WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = { libroRepository };
