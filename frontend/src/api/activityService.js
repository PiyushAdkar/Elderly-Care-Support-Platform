import client from './client';

export const logActivity = async (data) => {
  const response = await client.post('/activities', data);
  return response.data;
};

export const getActivities = async (params) => {
  const response = await client.get('/activities', { params });
  return response.data;
};

export const getTodayActivity = async () => {
  const response = await client.get('/activities/today');
  return response.data;
};

export const getWeeklySummary = async () => {
  const response = await client.get('/activities/weekly');
  return response.data;
};
