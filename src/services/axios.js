import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API,
  headers: {
    accept: 'application/ld+json',
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
