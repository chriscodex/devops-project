import { createContext, useContext, useState } from 'react';
import {
  getOrdenesRequest,
  createOrdenRequest,
  createServicioAdicionalByOrdenIdRequest,
  deleteOrdenRequest,
  deleteServicioAdicionalRequest,
  getDniDataAPIRequest,
  getOrdenDataRequest,
  getOrdenesByEstadoRequest,
  getRucDataRequest,
  getServiciosAdicionalesByOrdenIdRequest,
  updateOrdenRequest,
  updateServicioAdicionalRequest,
  getPrioridadesRequest,
  getAreasRequest,
  getTiposServicioRequest,
  getTotalServiciosAdicionalesByOrderIdRequest,
  getOrdenesFinalizadasRequest,
  getOrdenesByClienteRequest,
  getOrdenesByParametersRequest,
} from '../api/ordenes.js';
import {
  createMarcaRequest,
  deleteMarcaRequest,
  getMarcasRequest,
  updateMarcaRequest,
} from '../api/equipo/marcas';
import {
  getCategoriasEquipoRequest,
  createCategoriaEquipoRequest,
  deleteCategoriaEquipoRequest,
  updateCategoriaEquipoRequest,
} from '../api/equipo/categories';
import {
  getClientByDniRequest,
  getClientByIdRequest,
  getClientByRucRequest,
  getClientsByParametersRequest,
  updateClientOrdenRequest,
} from '../api/clients.js';
import { getUsersRequest } from '../api/users.js';
import {
  createAreaRequest,
  createPrioridadRequest,
  createTipoServicioRequest,
  deleteAreaRequest,
  deletePrioridadRequest,
  deleteTipoServicioRequest,
  updateAreaRequest,
  updatePrioridadRequest,
  updateTipoServicioRequest,
} from '../api/controlPanel.js';
import { ordenarAlfabeticamente } from '../utils/ordenarOrdenesAlfabeticamente.js';

const OrdenContext = createContext();

export function useOrden() {
  const context = useContext(OrdenContext);
  if (!context) {
    throw new Error('useOrden must be used within a OrdenProvider');
  }

  return context;
}

export function OrdenProvider({ children }) {
  const [ordenes, setOrdenes] = useState([]);
  const [cliente, setCliente] = useState({});
  const [equipo, setEquipo] = useState({});
  const [marcas, setMarcas] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [areas, setAreas] = useState([]);
  const [tiposServicio, setTiposServicio] = useState([]);
  const [categoriasEquipo, setCategoriasEquipo] = useState([]);
  const [newOrdenData, setNewOrdenData] = useState({});
  const [currentPageOrdenes, setCurrentPageOrdenes] = useState('pendiente');

  const getOrdenData = async (id) => {
    try {
      const res = await getOrdenDataRequest(id);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getOrdenes = async () => {
    try {
      const res = await getOrdenesRequest();
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getOrdenesByEstado = async (estado) => {
    try {
      const res = await getOrdenesByEstadoRequest(estado);
      setOrdenes(ordenarAlfabeticamente(res.data));
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  const getOrdenesNumberByEstado = async (estado) => {
    try {
      const res = await getOrdenesByEstadoRequest(estado);
      return res.data.length;
    } catch (error) {
      console.log(error);
    }
  };

  const getOrdenesByParameters = async (params, pagina, elementosPorPagina) => {
    try {
      const res = await getOrdenesByParametersRequest(
        params,
        pagina,
        elementosPorPagina
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  const getClientsByParameters = async (params, pagina, elementosPorPagina) => {
    try {
      const res = await getClientsByParametersRequest(
        params,
        pagina,
        elementosPorPagina
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getOrdenesFinalizadas = async (pagina) => {
    try {
      const res = await getOrdenesFinalizadasRequest(pagina);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getOrdenesByCliente = async (
    id,
    params,
    pagina,
    elementosPorPagina
  ) => {
    try {
      const res = await getOrdenesByClienteRequest(
        id,
        params,
        pagina,
        elementosPorPagina
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const createOrden = async (data) => {
    try {
      const response = await createOrdenRequest(data);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const updateOrden = async (id, payload) => {
    try {
      const response = await updateOrdenRequest(id, payload);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateClientOrden = async (clientId, ordenId, payload) => {
    try {
      const response = await updateClientOrdenRequest(
        clientId,
        ordenId,
        payload
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getServiciosAdicionalesByOrdenId = async (ordenId) => {
    try {
      const res = await getServiciosAdicionalesByOrdenIdRequest(ordenId);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalServiciosAdicionalesByOrdenId = async (ordenId) => {
    try {
      const res = await getTotalServiciosAdicionalesByOrderIdRequest(ordenId);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const createServicioAdicional = async (ordenId, payload) => {
    try {
      const response = await createServicioAdicionalByOrdenIdRequest(
        ordenId,
        payload
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateServicioAdicional = async (id, payload) => {
    try {
      const response = await updateServicioAdicionalRequest(id, payload);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteServicioAdicional = async (servicioId) => {
    try {
      const response = await deleteServicioAdicionalRequest(servicioId);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteOrden = async (id) => {
    try {
      const response = await deleteOrdenRequest(id);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getClientById = async (orderId) => {
    try {
      const res = await getClientByIdRequest(orderId);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getClientByDni = async (dni) => {
    try {
      const res = await getClientByDniRequest(dni);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getClientByRuc = async (ruc) => {
    try {
      const res = await getClientByRucRequest(ruc);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getClientDataAPIByDni = async (dni) => {
    try {
      const res = await getDniDataAPIRequest(dni);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const getRucData = async (ruc) => {
    try {
      const res = await getRucDataRequest(ruc);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const getAllMarcas = async () => {
    try {
      const res = await getMarcasRequest();
      setMarcas(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const createMarca = async (marca) => {
    try {
      const res = await createMarcaRequest(marca);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateMarca = async (id, marca) => {
    try {
      const res = await updateMarcaRequest(id, marca);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMarca = async (id) => {
    try {
      const res = await deleteMarcaRequest(id);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCategoriasEquipo = async () => {
    try {
      const res = await getCategoriasEquipoRequest();
      setCategoriasEquipo(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const createCategoriaEquipo = async (categoria) => {
    try {
      const res = await createCategoriaEquipoRequest(categoria);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategoriaEquipo = async (id) => {
    try {
      const res = await deleteCategoriaEquipoRequest(id);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateCategoriaEquipo = async (id, categoria) => {
    try {
      const res = await updateCategoriaEquipoRequest(id, categoria);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getPrioridades = async () => {
    try {
      const response = await getPrioridadesRequest();
      setPrioridades(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const createPrioridad = async (prioridad) => {
    try {
      const response = await createPrioridadRequest(prioridad);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const deletePrioridad = async (id) => {
    try {
      const response = await deletePrioridadRequest(id);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updatePrioridad = async (id, prioridad) => {
    try {
      const response = await updatePrioridadRequest(id, prioridad);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getAreas = async () => {
    try {
      const response = await getAreasRequest();
      setAreas(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const createArea = async (area) => {
    try {
      const response = await createAreaRequest(area);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteArea = async (id) => {
    try {
      const response = await deleteAreaRequest(id);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateArea = async (id, area) => {
    try {
      const response = await updateAreaRequest(id, area);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getTiposServicios = async () => {
    try {
      const response = await getTiposServicioRequest();
      setTiposServicio(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const createTipoServicio = async (tipoServicio) => {
    try {
      const response = await createTipoServicioRequest(tipoServicio);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTipoServicio = async (id) => {
    try {
      const response = await deleteTipoServicioRequest(id);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateTipoServicio = async (id, tipoServicio) => {
    try {
      const response = await updateTipoServicioRequest(id, tipoServicio);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getUsers = async () => {
    try {
      const res = await getUsersRequest();
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <OrdenContext.Provider
      value={{
        ordenes,
        setOrdenes,
        getOrdenes,
        getOrdenData,
        getOrdenesByEstado,
        getOrdenesNumberByEstado,
        deleteOrden,
        getClientByDni,
        getClientByRuc,
        getClientDataAPIByDni,
        getRucData,
        cliente,
        setCliente,
        marcas,
        setMarcas,
        newOrdenData,
        setNewOrdenData,
        getAllMarcas,
        createMarca,
        equipo,
        setEquipo,
        categoriasEquipo,
        setCategoriasEquipo,
        getAllCategoriasEquipo,
        createCategoriaEquipo,
        createOrden,
        updateOrden,
        createServicioAdicional,
        updateServicioAdicional,
        deleteServicioAdicional,
        getServiciosAdicionalesByOrdenId,
        getTotalServiciosAdicionalesByOrdenId,
        prioridades,
        getPrioridades,
        areas,
        getAreas,
        tiposServicio,
        getTiposServicios,
        currentPageOrdenes,
        setCurrentPageOrdenes,
        getOrdenesFinalizadas,
        getUsers,
        updateClientOrden,
        getOrdenesByCliente,
        createPrioridad,
        deletePrioridad,
        updatePrioridad,
        createArea,
        deleteArea,
        updateArea,
        createTipoServicio,
        deleteTipoServicio,
        updateTipoServicio,
        updateMarca,
        deleteMarca,
        deleteCategoriaEquipo,
        updateCategoriaEquipo,
        getOrdenesByParameters,
        getClientsByParameters,
        getClientById,
      }}
    >
      {children}
    </OrdenContext.Provider>
  );
}
