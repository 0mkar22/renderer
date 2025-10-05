import axios from 'axios';

// This URL points to the internal backend server running inside your Electron app
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export default api;
