import axios from '../axios.js';

export const getMarcasRequest = () => axios.get('/equipo/marcas');

export const createMarcaRequest = (marca) =>
  axios.post('/equipo/marcas', marca);

export const deleteMarcaRequest = (id) => axios.delete(`/equipo/marcas/${id}`);

export const updateMarcaRequest = (id, marca) =>
  axios.put(`/equipo/marcas/${id}`, marca);
