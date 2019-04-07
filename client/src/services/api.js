import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.API || 'http://localhost:8081',
  withCredentials: true,
});

export function post(path, content) {
  return axios.post(path, content);
}

export function get(path, data) {
  return axios.get(path, {
    params: {
      ...data,
    }
  });
}

export default {
  post, get,
};