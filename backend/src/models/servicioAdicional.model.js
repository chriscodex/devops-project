import mongoose from 'mongoose';

const servicioAdicionalSchema = new mongoose.Schema(
  {
    descripcion: {
      type: String,
      required: true,
    },
    costo: {
      type: String,
      required: true,
    },
    orden: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Orden',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('ServicioAdicional', servicioAdicionalSchema);
