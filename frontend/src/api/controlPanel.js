import axios from './axios.js';

// const API = 'http://15.228.221.241:3000/api';

// Prioridades
export const createPrioridadRequest = (prioridad) =>
  axios.post(`/prioridades`, prioridad);

export const deletePrioridadRequest = (id) =>
  axios.delete(`/prioridades/${id}`);

export const updatePrioridadRequest = (id, prioridad) =>
  axios.put(`/prioridades/${id}`, prioridad);

// Areas
export const createAreaRequest = (area) => axios.post(`/areas`, area);

export const deleteAreaRequest = (id) => axios.delete(`/areas/${id}`);

export const updateAreaRequest = (id, area) =>
  axios.put(`}/areas/${id}`, area);

// Tipo de Servicio
export const createTipoServicioRequest = (tipoServicio) =>
  axios.post(`/tipoServicios`, tipoServicio);

export const deleteTipoServicioRequest = (id) =>
  axios.delete(`/tipoServicios/${id}`);

export const updateTipoServicioRequest = (id, tipoServicio) =>
  axios.put(`/tipoServicios/${id}`, tipoServicio);

