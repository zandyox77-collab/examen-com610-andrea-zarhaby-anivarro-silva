const request = require('supertest');
const { createApp } = require('../src/app');

describe('API Catalogo de Libros', () => {
  let mockData;
  let app;

  beforeEach(() => {
    mockData = [
      { id: 1, titulo: 'Sistemas Distribuidos', autor: 'Tanenbaum', anio_publicacion: 2007 },
    ];
    const mockRepo = {
      findAll: async () => mockData,
      findById: async (id) => mockData.find((l) => l.id === Number(id)) || null,
      create: async (libro) => {
        const nuevo = { id: mockData.length + 1, ...libro };
        mockData.push(nuevo);
        return nuevo;
      },
      update: async (id, libro) => {
        const idx = mockData.findIndex((l) => l.id === Number(id));
        if (idx === -1) return null;
        mockData[idx] = { id: Number(id), ...libro };
        return mockData[idx];
      },
      remove: async (id) => {
        const idx = mockData.findIndex((l) => l.id === Number(id));
        if (idx === -1) return false;
        mockData.splice(idx, 1);
        return true;
      },
    };
    app = createApp(mockRepo);
  });

  test('GET /health responde 200 y estado activo', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('POST /libros crea un libro valido y responde 201', async () => {
    const res = await request(app)
      .post('/libros')
      .send({ titulo: 'Clean Code', autor: 'Robert C. Martin', anio_publicacion: 2008 });
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBe(2);
    expect(res.body.titulo).toBe('Clean Code');
  });

  test('POST /libros rechaza datos invalidos con 400', async () => {
    const res = await request(app)
      .post('/libros')
      .send({ titulo: '', autor: 'Autor', anio_publicacion: 'no-es-entero' });
    expect(res.statusCode).toBe(400);
  });

  test('GET /libros/:id responde 404 si el libro no existe', async () => {
    const res = await request(app).get('/libros/999');
    expect(res.statusCode).toBe(404);
  });
});
