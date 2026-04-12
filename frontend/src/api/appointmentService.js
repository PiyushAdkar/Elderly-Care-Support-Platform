import api from './client';

export const getDoctors = async (params = {}) => {
  const response = await api.get('/appointments/doctors', { params });
  return response.data;
};

export const getAppointments = async (params = {}) => {
  const response = await api.get('/appointments', { params });
  return response.data;
};

export const bookAppointment = async (data) => {
  const response = await api.post('/appointments', data);
  return response.data;
};

export const cancelAppointment = async (id) => {
  // Using PATCH to match the existing backend router.patch('/:id/cancel')
  const response = await api.patch(`/appointments/${id}/cancel`);
  return response.data;
};
