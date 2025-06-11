// db.test.js
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDB } from '../src/db.js'; // Ajusta el path si está en otra carpeta

describe('MongoDB Connection', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.DATABASE_URL = mongoServer.getUri();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should connect successfully to in-memory MongoDB', async () => {
    await connectDB();
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  });
});
