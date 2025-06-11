import mongoose from 'mongoose';

const tecnicoSchema = new mongoose.Schema({
  dni: {
    type: String,
    required: true,
  },
  nombres: {
    type: String,
    required: true,
  },
  apellidos: {
    type: String,
    required: true,
  },
  celular: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    required: false,
    default: 'tecnico',
  },
});

export default mongoose.model('Tecnico', tecnicoSchema);
