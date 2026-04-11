import client from './client';

export const getDocuments = async (params) => {
  const response = await client.get('/documents', { params });
  return response;
};

export const getDocument = async (id) => {
  const response = await client.get(`/documents/${id}`);
  return response;
};

export const uploadDocument = async (formData) => {
  const response = await client.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response;
};

export const updateDocument = async (id, data) => {
  const response = await client.put(`/documents/${id}`, data);
  return response;
};

export const deleteDocument = async (id) => {
  const response = await client.delete(`/documents/${id}`);
  return response;
};

export const downloadDocument = async (id, filename) => {
  // CRITICAL: Set responseType to 'blob' to handle binary data properly
  const response = await client.get(`/documents/${id}/download`, {
    responseType: 'blob',
  });
  
  // Create a URL Blob and trigger native browser download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  
  // Set the downloaded file name
  link.setAttribute('download', filename);
  
  // Append to the DOM securely, click, and clean up
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
