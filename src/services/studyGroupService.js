import { http } from './httpClient';

export const fetchStudyGroups = async (params = {}) => {
  const response = await http.get(`/study-groups`, { params });
  return response.data;
};

export const createStudyGroup = async (data) => {
  const response = await http.post(`/study-groups`, data);
  return response.data;
};

export const joinStudyGroup = async (groupId) => {
  const response = await http.post(`/study-groups/${groupId}/join`);
  return response.data;
};

export const leaveStudyGroup = async (groupId) => {
  const response = await http.post(`/study-groups/${groupId}/leave`);
  return response.data;
};

export const fetchMyStudyGroups = async (params = {}) => {
  const response = await http.get(`/study-groups/my-groups`, { params });
  return response.data;
};

export const updateStudyGroup = async (groupId, data) => {
  const response = await http.put(`/study-groups/${groupId}`, data);
  return response.data;
};

export const deleteStudyGroup = async (groupId) => {
  const response = await http.delete(`/study-groups/${groupId}`);
  return response.data;
};
