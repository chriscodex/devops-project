import axios from 'axios';
import https from 'https';

import Orden from '../models/orden.model.js';
import ServicioAdicional from '../models/servicioAdicional.model.js';
import Prioridad from '../models/orden/prioridad.model.js';
import Area from '../models/orden/area.model.js';
import TipoServicio from '../models/orden/tipoServicio.model.js';
import Client from '../models/client.model.js';
import mongoose from 'mongoose';

export const getOrden = async (req, res) => {
  try {
    const orden = await Orden.findById(req.params.id).populate([
      'user',
      'cliente',
    ]);
    if (!orden) return res.status(404).json({ message: 'Orden not found' });
    res.json(orden);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find().populate(['user', 'cliente']);
    res.json(ordenes);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getOrdenesFinalizadas = async (req, res) => {
  try {
    const { pagina = 1, elementosPorPagina = 18 } = req.query;
    const skip = (pagina - 1) * elementosPorPagina;
    const ordenes = await Orden.find({ finalizada: true })
      .populate(['user', 'cliente'])
      .skip(skip)
      .limit(elementosPorPagina);
    res.json(ordenes);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getOrdenesByEstado = async (req, res) => {
  try {
    const ordenes = await Orden.find({ estado: req.params.estado }).populate([
      'user',
      'cliente',
    ]);
    res.json(ordenes);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getOrdenesByCliente = async (req, res) => {
  try {
    const {
      creacionFechaInicio,
      creacionFechaFinal,
      entregaFechaInicio,
      entregaFechaFinal,
    } = req.body;

    const { pagina = 1, elementosPorPagina = 3 } = req.query;
    const skip = (pagina - 1) * elementosPorPagina;

    let queryOrders = {};

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

    const ordenes = await Orden.find({ cliente: req.params.id, ...queryOrders })
      .populate(['cliente'])
      .skip(skip)
      .limit(elementosPorPagina);
    res.json(ordenes);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getOrdenesByParameters = async (req, res) => {
  try {
    const {
      orderId,
      estado,
      area,
      tipoServicio,
      userId,
      creacionFechaInicio,
      creacionFechaFinal,
      entregaFechaInicio,
      entregaFechaFinal,
      marca,
      categoriaEquipo,
    } = req.body;

    const { pagina = 1, elementosPorPagina = 3 } = req.query;
    const skip = (pagina - 1) * elementosPorPagina;

    let query = {};
    if (orderId) {
      query = { identificador: orderId };
    }
    if (estado) {
      query = { ...query, estado: estado };
    }
    if (area) {
      query = { ...query, area: area };
    }
    if (tipoServicio) {
      query = { ...query, tipoServicio: tipoServicio };
    }
    if (userId) {
      query = { ...query, user: userId };
    }
    if (marca) {
      query = { ...query, 'equipo.marca': marca };
    }
    if (categoriaEquipo) {
      query = { ...query, 'equipo.categoria': categoriaEquipo };
    }
    if (creacionFechaInicio && creacionFechaFinal) {
      if (creacionFechaInicio == creacionFechaFinal) {
        const fecha = new Date(creacionFechaInicio);
        fecha.setHours(-5);

        const fechaSiguiente = new Date(fecha);
        fechaSiguiente.setHours(-5);
        fechaSiguiente.setDate(fechaSiguiente.getDate() + 2);

        query = {
          ...query,
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

        query = {
          ...query,
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

        query = {
          ...query,
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

        query = {
          ...query,
          fecha: {
            $gte: entregaFechaInicioDate,
            $lte: entregaFechaFinalSiguienteDate,
          },
        };
      }
    }

    const ordenes = await Orden.find(query)
      .populate(['user', 'cliente'])
      .skip(skip)
      .limit(elementosPorPagina);

    res.json(ordenes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getOrdenesByDate = async (req, res) => {
  try {
    const { fechaInicio, fechaFinal } = req.body;

    const curr = new Date(fechaInicio);
    const ordenes = await Orden.find({
      createdAt: { $gte: fechaInicio },
    }).populate(['user', 'cliente']);

    res.json(ordenes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const createOrden = async (req, res) => {
  try {
    const {
      equipo,
      prioridad,
      area,
      tipoServicio,
      trabajo,
      fecha,
      monto,
      estado,
      createdAt,
    } = req.body;

    const {
      tipo: tipoCliente,
      celular,
      email,
      dni,
      personaResponsable,
      ruc,
      razonSocial,
    } = req.body.cliente;

    let clientData = {};
    let ordenData = {};
    let clientId = '';

    if (tipoCliente === 'persona') {
      const cliente = await Client.find({
        dni,
      });

      if (cliente.length === 0) {
        clientData = {
          tipo: tipoCliente,
          dni,
          personaResponsable,
          celular,
          email,
        };

        const newCliente = new Client(clientData);
        const savedClient = await newCliente.save();
        clientId = savedClient._id;
      } else {
        if (personaResponsable) {
          clientData = {
            personaResponsable,
          };
        } else {
          clientData = {
            personaResponsable: cliente[0].personaResponsable,
          };
        }
        if (celular) {
          clientData = {
            ...clientData,
            celular,
          };
        } else {
          clientData = {
            ...clientData,
            celular: cliente[0].celular,
          };
        }
        const ordenUpdated = await Client.findByIdAndUpdate(
          cliente[0]._id,
          clientData
        );
        clientId = cliente[0]._id;
      }

      ordenData = {
        cliente: clientId,
        equipo,
        prioridad,
        area,
        tipoServicio,
        trabajo,
        fecha,
        monto,
        estado,
        createdAt,
        user: req.user.payload.id,
      };

      const newOrden = new Orden(ordenData);

      const savedOrden = await newOrden.save();

      const identificador = savedOrden._id.toString().slice(-6);

      const ordenUpdated = await Orden.findByIdAndUpdate(savedOrden._id, {
        identificador,
      });

      res.json(ordenUpdated);
    }
    if (tipoCliente === 'empresa') {
      const clienteFound = await Client.find({
        ruc,
      });

      if (clienteFound.length === 0) {
        clientData = {
          tipo: tipoCliente,
          ruc,
          razonSocial,
          personaResponsable,
          celular,
          email,
        };

        const newCliente = new Client(clientData);

        const savedClient = await newCliente.save();
        clientId = savedClient._id;
      } else {
        if (razonSocial) {
          clientData = {
            razonSocial,
          };
        } else {
          clientData = {
            razonSocial: clienteFound[0].razonSocial,
          };
        }
        if (personaResponsable) {
          clientData = {
            ...clientData,
            personaResponsable,
          };
        } else {
          clientData = {
            ...clientData,
            personaResponsable: clienteFound[0].personaResponsable,
          };
        }
        if (celular) {
          clientData = {
            ...clientData,
            celular,
          };
        } else {
          clientData = {
            ...clientData,
            celular: clienteFound[0].celular,
          };
        }
        if (email) {
          clientData = {
            ...clientData,
            email,
          };
        } else {
          clientData = {
            ...clientData,
            email: clienteFound[0].email,
          };
        }
        const ordenUpdated = await Client.findByIdAndUpdate(
          clienteFound[0]._id,
          clientData
        );

        clientId = clienteFound[0]._id;
      }

      ordenData = {
        cliente: clientId,
        equipo,
        prioridad,
        area,
        tipoServicio,
        trabajo,
        fecha,
        monto,
        estado,
        createdAt,
        user: req.user.payload.id,
      };

      const newOrden = new Orden(ordenData);

      const savedOrden = await newOrden.save();

      const identificador = savedOrden._id.toString().slice(-6);

      const ordenUpdated = await Orden.findByIdAndUpdate(savedOrden._id, {
        identificador,
      });

      res.json(ordenUpdated);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const updateOrden = async (req, res) => {
  try {
    const orden = await Orden.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!orden) return res.status(404).json({ message: 'Orden not found' });
    res.json(orden);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const updateClientOrden = async (req, res) => {
  try {
    // Persona - Persona & Empresa a Persona
    if (req.body?.dni) {
      const clientFound = await Client.findOne({ dni: req.body.dni });

      if (!clientFound) {
        const newCliente = new Client(req.body);
        const savedClient = await newCliente.save();
        const ordenUpdated = await Orden.findByIdAndUpdate(req.params.ordenId, {
          cliente: savedClient._id,
        });
        return res.json(ordenUpdated);
      } else {
        const ordenActual = await Orden.findById(req.params.ordenId);
        const clienteActual = await Client.findById(ordenActual.cliente._id);
        if (clientFound?.tipo === 'persona') {
          if (req.body?.dni === clienteActual?.dni) {
            const clientUpdated = await Client.findByIdAndUpdate(
              clientFound._id,
              req.body
            );
            res.json(clientUpdated);
          } else {
            const ordenUpdated = await Orden.findByIdAndUpdate(
              req.params.ordenId,
              {
                cliente: clientFound._id,
              }
            );
            res.json('ordenUpdated');
          }
        }
        if (clientFound?.tipo === 'empresa') {
          const ordenUpdated = await Orden.findByIdAndUpdate(
            req.params.ordenId,
            {
              cliente: clientFound._id,
            }
          );
          res.json('ordenUpdated');
        }
      }
    }
    // Persona - Empresa & Empresa a Empresa
    if (req.body?.ruc) {
      const clientFound = await Client.findOne({ ruc: req.body.ruc });
      if (!clientFound) {
        const newCliente = new Client(req.body);
        const savedClient = await newCliente.save();
        const ordenUpdated = await Orden.findByIdAndUpdate(req.params.ordenId, {
          cliente: savedClient._id,
        });
        return res.json(ordenUpdated);
      } else {
        const ordenActual = await Orden.findById(req.params.ordenId);
        const clienteActual = await Client.findById(ordenActual.cliente._id);
        if (clientFound?.tipo === 'empresa') {
          if (req.body?.ruc === clienteActual?.ruc) {
            const clientUpdated = await Client.findByIdAndUpdate(
              clientFound._id,
              req.body
            );
            res.json(clientUpdated);
          } else {
            const ordenUpdated = await Orden.findByIdAndUpdate(
              req.params.ordenId,
              {
                cliente: clientFound._id,
              }
            );
            res.json('ordenUpdated');
          }
        }
        if (clientFound?.tipo === 'persona') {
          const ordenUpdated = await Orden.findByIdAndUpdate(
            req.params.ordenId,
            {
              cliente: clientFound._id,
            }
          );
          res.json('ordenUpdated');
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const createServicioAdicional = async (req, res) => {
  try {
    const { descripcion, costo } = req.body;
    const { ordenId } = req.params;

    const newServicioAdicional = new ServicioAdicional({
      descripcion,
      costo,
      orden: ordenId,
    });

    const savedServicioAdicional = await newServicioAdicional.save();
    res.json(savedServicioAdicional);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const updateServicioAdicional = async (req, res) => {
  try {
    const { servicioId } = req.params;
    const { descripcion, costo } = req.body;
    const response = await ServicioAdicional.findByIdAndUpdate(
      servicioId,
      {
        $set: {
          descripcion,
          costo,
        },
      },
      { new: true }
    );
    res.json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getTotalServiciosAdicionalesByOrderId = async (req, res) => {
  try {
    const { ordenId } = req.params;
    const totalServicioAdicionales = await ServicioAdicional.find({
      orden: ordenId,
    });
    const sumaCostos = totalServicioAdicionales.reduce(
      (acumulador, servicioAdicional) => {
        const costo = parseFloat(servicioAdicional.costo);
        return acumulador + costo;
      },
      0
    );
    res.json({ costoTotal: sumaCostos });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const deleteServicioAdicional = async (req, res) => {
  try {
    const { servicioId } = req.params;
    const response = await ServicioAdicional.findByIdAndDelete(servicioId);
    res.json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getAllServiciosAdicionalesByOrderId = async (req, res) => {
  try {
    const { ordenId } = req.params;
    const serviciosAdicionales = await ServicioAdicional.find({
      orden: ordenId,
    });
    res.json(serviciosAdicionales);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const deleteOrden = async (req, res) => {
  try {
    const orden = await Orden.findByIdAndDelete(req.params.id);
    if (!orden) return res.status(404).json({ message: 'Orden not found' });
    res.json(orden);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getDniData = async (req, res) => {
  try {
    const { dni } = req.body;

    // Datos
    const token = process.env.TOKEN_API_RUC_DNI;

    // URL de la API
    const apiUrl = `https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`;

    // Configuración de la solicitud
    const axiosConfig = {
      method: 'get',
      url: apiUrl,
      headers: {
        Referer: 'https://apis.net.pe/consulta-dni-api',
        Authorization: `Bearer ${token}`,
      },
      // Utiliza el módulo 'https' para crear el agente httpsAgent
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    // Realizar la llamada a la API
    const response = await axios(axiosConfig);
    res.json(response.data);

    // const response = {
    //   data: {
    //     nombres: 'CHRISTIAN GONZALO',
    //     apellidoPaterno: 'ESPINOZA',
    //     apellidoMaterno: 'CADILLO',
    //     tipoDocumento: '1',
    //     numeroDocumento: '74062106',
    //   },
    // };

    // setTimeout(() => {
    //   res.json(response.data);
    // }, 1000);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getRucData = async (req, res) => {
  try {
    // RUC
    const { ruc } = req.body;
    // Datos
    const token = process.env.TOKEN_API_RUC_DNI;
    // URL de la API
    const apiUrl = `https://api.apis.net.pe/v2/sunat/ruc?numero=${ruc}`;
    // Configuración de la solicitud
    const axiosConfig = {
      method: 'get',
      url: apiUrl,
      headers: {
        Referer: 'http://apis.net.pe/api-ruc',
        Authorization: `Bearer ${token}`,
      },
      // Utiliza el módulo 'https' para crear el agente httpsAgent
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };
    // Realizar la llamada a la API
    const response = await axios(axiosConfig);
    res.json(response.data);

    // const response = {
    //   data: {
    //     razonSocial: 'ARENERA SAN MARTIN DE PORRAS S.A.',
    //     tipoDocumento: '6',
    //     numeroDocumento: '20428729201',
    //     estado: 'ACTIVO',
    //     condicion: 'HABIDO',
    //     direccion: 'AV. MONTEVERDE NRO 197 ',
    //     ubigeo: '150103',
    //     viaTipo: 'AV.',
    //     viaNombre: 'MONTEVERDE',
    //     zonaCodigo: '-',
    //     zonaTipo: '-',
    //     numero: '197',
    //     interior: '-',
    //     lote: '-',
    //     dpto: '-',
    //     manzana: '-',
    //     kilometro: '-',
    //     distrito: 'ATE',
    //     provincia: 'LIMA',
    //     departamento: 'LIMA',
    //     EsAgenteRetencion: false,
    //   },
    // };

    // setTimeout(() => {
    //   res.json(response.data);
    // }, 500);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const createPrioridad = async (req, res) => {
  try {
    const { prioridad } = req.body;

    const newPrioridad = new Prioridad({
      prioridad,
    });

    const prioridadSaved = await newPrioridad.save();
    res.json(prioridadSaved);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getPrioridades = async (req, res) => {
  try {
    const prioridades = await Prioridad.find();
    res.json(prioridades);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const updatePrioridad = async (req, res) => {
  try {
    const prioridad = await Prioridad.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!prioridad)
      return res.status(404).json({ message: 'Prioridad not found' });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const deletePrioridad = async (req, res) => {
  try {
    const prioridad = await Prioridad.findByIdAndDelete(req.params.id);
    if (!prioridad)
      return res.status(404).json({ message: 'Prioridad not found' });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

// Area
export const createArea = async (req, res) => {
  try {
    const { area } = req.body;

    const newArea = new Area({
      area,
    });

    const areaSaved = await newArea.save();
    res.json(areaSaved);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getAreas = async (req, res) => {
  try {
    const areas = await Area.find();
    res.json(areas);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const updateArea = async (req, res) => {
  try {
    const area = await Area.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!area) return res.status(404).json({ message: 'area no encontrada' });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const deleteArea = async (req, res) => {
  try {
    const area = await Area.findByIdAndDelete(req.params.id);
    if (!area) return res.status(404).json({ message: 'area no encontrada' });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

// Tipo de Servicio
export const createTipoServicio = async (req, res) => {
  try {
    const { tipoServicio } = req.body;

    const newTipoServicio = new TipoServicio({
      tipoServicio,
    });

    const tipoServicioSaved = await newTipoServicio.save();
    res.json(tipoServicioSaved);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getTiposServicio = async (req, res) => {
  try {
    const tiposServicio = await TipoServicio.find();
    res.json(tiposServicio);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const updateTipoServicio = async (req, res) => {
  try {
    const tipoServicio = await TipoServicio.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!tipoServicio)
      return res
        .status(404)
        .json({ message: 'tipo de servicio no encontrado' });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const deleteTipoServicio = async (req, res) => {
  try {
    const tipoServicio = await TipoServicio.findByIdAndDelete(req.params.id);
    if (!tipoServicio)
      return res
        .status(404)
        .json({ message: 'tipo de servicio no encontrado' });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};
