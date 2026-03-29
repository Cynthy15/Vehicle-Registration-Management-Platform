import axios from 'axios';

// Using the provided valid API base URL
const API_URL = import.meta.env.VITE_API_URL || 'https://student-management-system-backend.up.railway.app/api/vehicle-service';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const vehicleApi = {
  // Public
  getAllVehicles: () => api.get('https://student-management-system-backend.up.railway.app/api/vehicle-service/vehicle').then(res => res.data),
  
  // Protected
  createVehicle: (data) => api.post('/vehicle', data).then(res => res.data),
  updateVehicle: (id, data) => api.put(`/vehicle/${id}`, data).then(res => res.data),
  deleteVehicle: (id) => api.delete(`/vehicle/${id}`).then(res => res.data),
  getVehicleDetails: (id) => api.get(`/vehicle/${id}`).then(res => res.data),
  
  // Segmented
  getVehicleInfo: (id) => api.get(`/vehicle/${id}/info`).then(res => res.data),
  getVehicleOwner: (id) => api.get(`/vehicle/${id}/owner`).then(res => res.data),
  getVehicleRegistration: (id) => api.get(`/vehicle/${id}/registration`).then(res => res.data),
  getVehicleInsurance: (id) => api.get(`/vehicle/${id}/insurance`).then(res => res.data),
};

export default api;
