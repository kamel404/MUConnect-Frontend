import { http } from './httpClient';

export const fetchTutoringOffers = async (params = {}) => {
  const response = await http.get('/tutoring-offers', { params });
  return response.data;
};

export const fetchMyTutoringOffers = async (params = {}) => {
  const response = await http.get('/tutoring-offers/my', { params });
  return response.data;
};

export const fetchTutoringOffer = async (id) => {
  const response = await http.get(`/tutoring-offers/${id}`);
  return response.data;
};

export const createTutoringOffer = async (data) => {
  const response = await http.post('/tutoring-offers', data);
  return response.data;
};

export const updateTutoringOffer = async (id, data) => {
  const response = await http.put(`/tutoring-offers/${id}`, data);
  return response.data;
};

export const deleteTutoringOffer = async (id) => {
  const response = await http.delete(`/tutoring-offers/${id}`);
  return response.data;
};

export const sendTutoringRequest = async (offerId, data) => {
  const response = await http.post(`/tutoring-offers/${offerId}/request`, data);
  return response.data;
};

export const fetchIncomingTutoringRequests = async (params = {}) => {
  const response = await http.get('/tutoring-requests/incoming', { params });
  return response.data;
};

export const fetchOutgoingTutoringRequests = async (params = {}) => {
  const response = await http.get('/tutoring-requests/outgoing', { params });
  return response.data;
};

export const updateTutoringRequest = async (requestId, data) => {
  const response = await http.put(`/tutoring-requests/${requestId}`, data);
  return response.data;
};

export const withdrawTutoringRequest = async (requestId) => {
  const response = await http.delete(`/tutoring-requests/${requestId}`);
  return response.data;
};
