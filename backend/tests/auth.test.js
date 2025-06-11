// tests/auth.test.js
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../src/app.js'; // asegúrate que exportas app
import User from '../src/models/user.model.js'; // ajusta el path

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany(); // limpia usuarios entre tests
});

describe('POST /api/register', () => {
  it('should register a new user', async () => {
    const newUser = {
      username: '12345678',
      apellidos: 'Pérez',
      nombres: 'Juan',
      celular: '999999999',
      email: 'juan@example.com',
      direccion: 'Calle Falsa 123',
      rol: 'cliente',
      password: 'supersegura',
    };

    const res = await request(app)
      .post('/api/register')
      .send(newUser)
      .expect(200);

    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toBe(newUser.username);
    expect(res.body.email).toBe(newUser.email);
  });

  it('should not allow duplicate username (DNI)', async () => {
    const user = {
      username: '12345678',
      apellidos: 'Pérez',
      nombres: 'Juan',
      celular: '999999999',
      email: 'juan@example.com',
      direccion: 'Calle Falsa 123',
      rol: 'cliente',
      password: 'supersegura',
    };

    // primer registro
    await request(app).post('/api/register').send(user).expect(200);

    // segundo registro con mismo username
    const res = await request(app).post('/api/register').send(user).expect(400);

    expect(res.body).toContain('DNI ya existe');
  });
});
