import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    apellidos: {
      type: String,
      required: true,
      trim: true,
    },
    nombres: {
      type: String,
      required: true,
      trim: true,
    },
    celular: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    direccion: {
      type: String,
      required: true,
      trim: true,
    },
    rol: {
      type: String,
      required: false,
      default: 'tecnico',
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  }
);

export default mongoose.model('User', userSchema);
