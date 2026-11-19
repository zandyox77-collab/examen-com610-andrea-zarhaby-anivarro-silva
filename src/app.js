const express = require('express');
const { libroRepository } = require('./db');

function createApp(repo = libroRepository) {
  const app = express();
  app.use(express.json());

  function validarLibro(body) {
    const { titulo, autor, anio_publicacion } = body || {};
    if (typeof titulo !== 'string' || titulo.trim().length === 0) return false;
    if (typeof autor !== 'string' || autor.trim().length === 0) return false;
    if (typeof anio_publicacion !== 'number' || !Number.isInteger(anio_publicacion)) return false;
    return true;
  }

  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'catalogo-libros-api',
      version: process.env.APP_VERSION || '1.0.0',
    });
  });

  app.get('/libros', async (req, res) => {
    try {
      const libros = await repo.findAll();
      res.status(200).json(libros);
    } catch (err) {
      res.status(500).json({ error: 'Error al consultar libros' });
    }
  });

  app.get('/libros/:id', async (req, res) => {
    try {
      const libro = await repo.findById(req.params.id);
      if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
      res.status(200).json(libro);
    } catch (err) {
      res.status(500).json({ error: 'Error al consultar el libro' });
    }
  });

  app.post('/libros', async (req, res) => {
    if (!validarLibro(req.body)) {
      return res.status(400).json({ error: 'Datos invalidos: titulo, autor y anio_publicacion (entero) son obligatorios' });
    }
    try {
      const nuevo = await repo.create(req.body);
      res.status(201).json(nuevo);
    } catch (err) {
      res.status(500).json({ error: 'Error al crear el libro' });
    }
  });

  app.put('/libros/:id', async (req, res) => {
    if (!validarLibro(req.body)) {
      return res.status(400).json({ error: 'Datos invalidos: titulo, autor y anio_publicacion (entero) son obligatorios' });
    }
    try {
      const actualizado = await repo.update(req.params.id, req.body);
      if (!actualizado) return res.status(404).json({ error: 'Libro no encontrado' });
      res.status(200).json(actualizado);
    } catch (err) {
      res.status(500).json({ error: 'Error al actualizar el libro' });
    }
  });

  app.delete('/libros/:id', async (req, res) => {
    try {
      const eliminado = await repo.remove(req.params.id);
      if (!eliminado) return res.status(404).json({ error: 'Libro no encontrado' });
      res.status(200).json({ message: 'Libro eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar el libro' });
    }
  });

  return app;
}

module.exports = { createApp };
