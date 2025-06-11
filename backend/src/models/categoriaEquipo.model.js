import mongoose from 'mongoose';

const categoriaEquipoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
})

export default mongoose.model('CategoriaEquipo', categoriaEquipoSchema);