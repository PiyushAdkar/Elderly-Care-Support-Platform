import client from './client';

export const getMedicines = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await client.get(`/medicines?${params.toString()}`);
  return response.data;
};

export const getMedicine = async (id) => {
  const response = await client.get(`/medicines/${id}`);
  return response.data;
};

export const addMedicine = async (data) => {
  const response = await client.post('/medicines', data);
  return response.data;
};

export const updateMedicine = async (id, data) => {
  const response = await client.put(`/medicines/${id}`, data);
  return response.data;
};

export const deleteMedicine = async (id) => {
  const response = await client.delete(`/medicines/${id}`);
  return response.data;
};

export const updateMedicineStatus = async (id, status) => {
  const response = await client.patch(`/medicines/${id}/status`, { status });
  return response.data;
};

export const getTodaySchedule = async () => {
  const response = await client.get('/medicines/today');
  return response.data;
};