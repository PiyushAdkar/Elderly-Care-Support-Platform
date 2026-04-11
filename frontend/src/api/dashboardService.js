import client from './client';

export const getTodayMedicines = async () => {
  const response = await client.get('/medicines/today');
  return response.data;
};

export const getUpcomingAppointments = async () => {
  const response = await client.get('/appointments');
  return response.data;
};

export const getWeeklyActivity = async () => {
  const response = await client.get('/activity/summary/weekly');
  return response.data;
};

export const getRecentUpdates = async () => {
  const response = await client.get('/activity');
  return response.data;
};

export const addMedicine = async (data) => {
  const response = await client.post('/medicines', data);
  return response.data;
};

export const addAppointment = async (data) => {
  const response = await client.post('/appointments', data);
  return response.data;
};

export const logActivity = async (data) => {
  const response = await client.post('/activity', data);
  return response.data;
};

export const markMedicineTaken = async (id) => {
  // Utilizing the existing status endpoint to mark as completed/taken for the demo
  const response = await client.patch(`/medicines/${id}/status`, { status: "completed" });
  return response.data;
};

