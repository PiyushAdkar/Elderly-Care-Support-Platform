import client from './client';

export const getContacts = async (params) => {
  const response = await client.get('/contacts', { params });
  return response;
};

export const getContact = async (id) => {
  const response = await client.get(`/contacts/${id}`);
  return response;
};

export const addContact = async (data) => {
  const response = await client.post('/contacts', data);
  return response;
};

export const updateContact = async (id, data) => {
  const response = await client.put(`/contacts/${id}`, data);
  return response;
};

export const deleteContact = async (id) => {
  const response = await client.delete(`/contacts/${id}`);
  return response;
};
