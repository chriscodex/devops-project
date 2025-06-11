import mongoose from 'mongoose';

const tipoServicioSchema = new mongoose.Schema({
  tipoServicio: {
    type: String,
    required: true,
  },
});

export default mongoose.model('TipoServicio', tipoServicioSchema);
