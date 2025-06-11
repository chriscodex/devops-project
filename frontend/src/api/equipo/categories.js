import axios from '../axios.js';

export const getCategoriasEquipoRequest = () => axios.get('/equipo/categorias');

export const createCategoriaEquipoRequest = (categoria) =>
  axios.post('/equipo/categorias', categoria);

export const deleteCategoriaEquipoRequest = (id) =>
  axios.delete(`/equipo/categorias/${id}`);

export const updateCategoriaEquipoRequest = (id, categoria) =>
  axios.put(`/equipo/categorias/${id}`, categoria);
