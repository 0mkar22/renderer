import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Work Order APIs
export const getWorkOrders = () => api.get('/work-orders');
export const getWorkOrder = (id) => api.get(`/work-orders/${id}`);
export const createWorkOrder = (workOrder) => api.post('/work-orders', workOrder);