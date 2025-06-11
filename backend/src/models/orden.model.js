import mongoose from 'mongoose';

const ordenSchema = new mongoose.Schema(
  {
    identificador: {
      type: String,
      required: false,
    },
    equipo: {
      marca: {
        type: String,
        required: true,
      },
      categoria: {
        type: String,
        required: true,
      },
      serie: {
        type: String,
        required: true,
      },
      producto: {
        type: String,
        required: true,
      },
      accesorios: {
        type: String,
        required: false,
      },
      observaciones: {
        type: String,
        required: false,
      },
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    prioridad: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    tipoServicio: {
      type: String,
      required: true,
    },
    trabajo: {
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
      default: Date.now,
    },
    monto: {
      type: String,
      required: true,
    },
    montoAdicional: {
      type: String,
      required: false,
      default: '0',
    },
    estado: {
      type: String,
      required: true,
    },
    finalizada: {
      type: Boolean,
      required: false,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  }
);

export default mongoose.model('Orden', ordenSchema);
