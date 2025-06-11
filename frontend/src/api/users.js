import axios from './axios.js';

// const API = 'http://15.228.221.241:3000/api';

export const updateUserRequest = (userId, newUser) =>
  axios.put(`/users/${userId}`, newUser);

export const getUsersRequest = () => axios.get(`/users`);

export const getUserRequest = (id) => axios.get(`/users/${id}`);

export const deleteUserRequest = (id) => axios.delete(`/users/${id}`);
