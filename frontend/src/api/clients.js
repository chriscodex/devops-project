import axios from './axios.js';

// const API = 'http://15.228.221.241:3000/api';

export const getClientByIdRequest = (id) =>
  axios.get(`/clientes/${id}`);

export const getClientByDniRequest = (dni) =>
  axios.get(`/clientes/dni/${dni}`);

export const getClientByRucRequest = (ruc) =>
  axios.get(`/clientes/ruc/${ruc}`);

export const updateClientOrdenRequest = (clientId, ordenId, data) =>
  axios.put(`/clientes/update/${clientId}/${ordenId}`, data);

export const getClientsRequest = () => axios.get(`/clientes`);

export const getClientsByParametersRequest = (
  params,
  pagina,
  elementosPorPagina
) => {
  if (!elementosPorPagina && elementosPorPagina !== 0) {
    return axios.post(`/clientes?pagina=${pagina}`, params);
  } else {
    return axios.post(
      `/clientes?pagina=${pagina}&elementosPorPagina=${elementosPorPagina}`,
      params
    );
  }
};
