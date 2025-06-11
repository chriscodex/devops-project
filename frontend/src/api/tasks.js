import axios from './axios.js';

const API = 'http://15.228.221.241:3000/api';

export const getTasksRequest = () => axios.get(`/tasks`);

export const getTaskRequest = (id) => axios.get(`/tasks/${id}`);

export const createTaskRequest = (task) => axios.post(`/tasks`, task);

export const updateTaskRequest = (id, task) =>
  axios.put(`/tasks/${id}`, task);

export const deleteTaskRequest = (id) => axios.delete(`/tasks/${id}`);
