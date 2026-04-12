import client from './client';

export const getEntertainment = async () => {
  const response = await client.get('/entertainment');
  return response.data;
};
