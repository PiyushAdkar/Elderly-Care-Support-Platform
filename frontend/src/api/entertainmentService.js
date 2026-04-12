import client from './client';

export const getEntertainment = async () => {
  const response = await client.get('/entertainment');
  return response.data;
};

export const searchMusic = async (query) => {
  const response = await client.get(`/entertainment/search?q=${encodeURIComponent(query)}`);
  return response.data;
};
