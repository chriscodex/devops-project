import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
  },
  ruc: {
    type: String,
    required: false,
  },
  razonSocial: {
    type: String,
    required: false,
  },
  personaResponsable: {
    type: String,
    required: false,
  },
  celular: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  dni: {
    type: String,
    required: false,
  },
});

export default mongoose.model('Client', clientSchema);
