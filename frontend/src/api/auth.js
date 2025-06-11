// import axios from 'axios';
import axios from './axios.js';

// const API = 'https://st.netcomputer.com.pe:3000/api';

export const registerRequest = (user) => axios.post(`/register`, user);

export const loginRequest = (user) => axios.post(`/login`, user);

export const verifyTokenRequest = () => axios.get(`/verify`);
