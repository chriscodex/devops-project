import Orden from '../models/orden.model.js';
import Client from '../models/client.model.js';

export const getClientById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const client = await Client.findById(orderId);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};
export const getClientByDni = async (req, res) => {
  try {
    const { dni } = req.params;
    const client = await Client.findOne({ dni });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getClientByRuc = async (req, res) => {
  try {
    const { ruc } = req.params;
    const client = await Client.findOne({ ruc });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getClients = async (req, res) => {
  try {
    const clientesUnicosIds = await Orden.distinct('cliente');

    const clientes = await Client.find({ _id: { $in: clientesUnicosIds } });
    res.json(clientes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getClientsByParameters = async (req, res) => {
  try {
    const {
      dniRuc,
      tipoCliente,
      creacionFechaInicio,
      creacionFechaFinal,
      entregaFechaInicio,
      entregaFechaFinal,
    } = req.body;

    const { pagina = 1, elementosPorPagina = 3 } = req.query;
    const skip = (pagina - 1) * elementosPorPagina;

    let queryClients = {};
    let queryOrders = {};
    if (dniRuc) {
      if (dniRuc.length === 8) {
        queryClients = { dni: dniRuc };
      }
      if (dniRuc.length === 11) {
        queryClients = { ruc: dniRuc };
      }
    }
    if (tipoCliente) {
      queryClients = { ...queryClients, tipo: tipoCliente };
    }
    if (creacionFechaInicio && creacionFechaFinal) {
      if (creacionFechaInicio == creacionFechaFinal) {
        const fecha = new Date(creacionFechaInicio);
        fecha.setHours(-5);

        const fechaSiguiente = new Date(fecha);
        fechaSiguiente.setHours(-5);
        fechaSiguiente.setDate(fechaSiguiente.getDate() + 2);

        queryOrders = {
          ...queryOrders,
          createdAt: {
            $gte: fecha,
            $lt: fechaSiguiente,
          },
        };
      } else {
        const creacionFechaInicioDate = new Date(creacionFechaInicio);
        creacionFechaInicioDate.setHours(-5);

        const creacionFechaFinalSiguienteDate = new Date(creacionFechaFinal);
        creacionFechaFinalSiguienteDate.setHours(-5);

        creacionFechaFinalSiguienteDate.setDate(
          creacionFechaFinalSiguienteDate.getDate() + 2
        );
        creacionFechaFinalSiguienteDate.setHours(-5);

        queryOrders = {
          ...queryOrders,
          createdAt: {
            $gte: creacionFechaInicioDate,
            $lte: creacionFechaFinalSiguienteDate,
          },
        };
      }
    }
    if (entregaFechaInicio && entregaFechaFinal) {
      if (entregaFechaInicio == entregaFechaFinal) {
        const fecha = new Date(entregaFechaInicio);
        fecha.setHours(-5);

        const fechaSiguiente = new Date(fecha);
        fechaSiguiente.setHours(-5);
        fechaSiguiente.setDate(fechaSiguiente.getDate() + 2);

        queryOrders = {
          ...queryOrders,
          fecha: {
            $gte: fecha,
            $lt: fechaSiguiente,
          },
        };
      } else {
        const entregaFechaInicioDate = new Date(entregaFechaInicio);
        entregaFechaInicioDate.setHours(-5);

        const entregaFechaFinalSiguienteDate = new Date(entregaFechaFinal);
        entregaFechaFinalSiguienteDate.setHours(-5);

        entregaFechaFinalSiguienteDate.setDate(
          entregaFechaFinalSiguienteDate.getDate() + 2
        );
        entregaFechaFinalSiguienteDate.setHours(-5);

        queryOrders = {
          ...queryOrders,
          fecha: {
            $gte: entregaFechaInicioDate,
            $lte: entregaFechaFinalSiguienteDate,
          },
        };
      }
    }
    const clientsOrders = await Orden.find(queryOrders).distinct('cliente');

    const clients = await Client.find({
      ...queryClients,
      _id: { $in: clientsOrders },
    })
      .skip(skip)
      .limit(elementosPorPagina);

    res.json(clients);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};
