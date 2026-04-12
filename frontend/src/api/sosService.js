import client from './client';

export const triggerSOS = async (payload) => {
  const response = await client.post('/sos', payload);
  return response;
};

export const getSosHistory = async (params) => {
  const response = await client.get('/sos/history', { params });
  return response;
};

export const resolveSOS = async (id, data) => {
  const response = await client.put(`/sos/${id}/resolve`, data);
  return response;
};
