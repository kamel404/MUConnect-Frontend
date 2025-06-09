import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const fetchStudyGroups = async (params = {}) => {
  const response = await axios.get(`${API_URL}/study-groups`, { params });
  return response.data;
};

export const createStudyGroup = async (data) => {
  const response = await axios.post(`${API_URL}/study-groups`, data);
  return response.data;
};

export const joinStudyGroup = async (groupId) => {
  const response = await axios.post(`${API_URL}/study-groups/${groupId}/join`);
  return response.data;
};

export const leaveStudyGroup = async (groupId) => {
  const response = await axios.post(`${API_URL}/study-groups/${groupId}/leave`);
  return response.data;
};

export const fetchMyStudyGroups = async (params = {}) => {
  const response = await axios.get(`${API_URL}/study-groups/my-groups`, { params });
  return response.data;
};

export const updateStudyGroup = async (groupId, data) => {
  const response = await axios.put(`${API_URL}/study-groups/${groupId}`, data);
  return response.data;
};

export const deleteStudyGroup = async (groupId) => {
  const response = await axios.delete(`${API_URL}/study-groups/${groupId}`);
  return response.data;
};
