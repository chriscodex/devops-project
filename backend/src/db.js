import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    await mongoose.connect(dbUrl);
    console.log('Database connected');
  } catch (error) {
    console.log(error);
  }
}
