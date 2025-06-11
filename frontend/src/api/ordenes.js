import axios from './axios.js';

// const API = 'http://15.228.221.241:3000/api';

export const getOrdenesRequest = () => axios.get(`/ordenes`);

export const getOrdenesByEstadoRequest = (estado) =>
  axios.get(`/ordenes/estado/${estado}`);

export const getOrdenesFinalizadasRequest = (pagina = 1) =>
  axios.get(`/ordenes-finalizadas?pagina=${pagina}`);

export const getOrdenDataRequest = (id) => axios.get(`/ordenes/${id}`);

export const createOrdenRequest = (orden) =>
  axios.post(`/ordenes`, orden);

export const updateOrdenRequest = (id, payload) =>
  axios.put(`/ordenes/${id}`, payload);

export const getServiciosAdicionalesByOrdenIdRequest = (ordenId) =>
  axios.get(`/ordenes/adicionales/${ordenId}`);

export const createServicioAdicionalByOrdenIdRequest = (ordenId, payload) =>
  axios.post(`/ordenes/adicionales/${ordenId}`, payload);

export const getTotalServiciosAdicionalesByOrderIdRequest = (ordenId) =>
  axios.get(`/ordenes/adicionales/total/${ordenId}`);

export const updateServicioAdicionalRequest = (id, payload) =>
  axios.put(`/ordenes/adicionales/${id}`, payload);

export const deleteServicioAdicionalRequest = (servicioId) =>
  axios.delete(`/ordenes/adicionales/${servicioId}`);

export const deleteOrdenRequest = (id) => axios.delete(`/ordenes/${id}`);

export const getDniDataAPIRequest = (dni) => axios.post(`/dni`, dni);

export const getRucDataRequest = (ruc) => axios.post(`/ruc`, ruc);

// Prioridades
export const getPrioridadesRequest = () => axios.get(`/prioridades`);

// Areas
export const getAreasRequest = () => axios.get(`/areas`);

// Tipo de Servicio
export const getTiposServicioRequest = () => axios.get(`/tipoServicios`);

export const getOrdenesByClienteRequest = (
  id,
  params,
  pagina,
  elementosPorPagina
) => {
  if (!elementosPorPagina && elementosPorPagina !== 0) {
    return axios.post(`/ordenes/cliente/${id}?pagina=${pagina}`, params);
  } else {
    return axios.post(
      `/ordenes/cliente/${id}?pagina=${pagina}&elementosPorPagina=${elementosPorPagina}`,
      params
    );
  }
};

export const getOrdenesByParametersRequest = (
  params,
  pagina,
  elementosPorPagina
) => {
  if (!elementosPorPagina && elementosPorPagina !== 0) {
    return axios.post(`/ordenes/reportes?pagina=${pagina}`, params);
  } else {
    return axios.post(
      `/ordenes/reportes?pagina=${pagina}&elementosPorPagina=${elementosPorPagina}`,
      params
    );
  }
};
