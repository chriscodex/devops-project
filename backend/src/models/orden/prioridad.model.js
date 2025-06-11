import mongoose from 'mongoose';

const prioridadOrdenSchema = new mongoose.Schema(
  {
    prioridad: {
      type: String,
      required: true,
    },
  }
)

export default mongoose.model('Prioridad', prioridadOrdenSchema);