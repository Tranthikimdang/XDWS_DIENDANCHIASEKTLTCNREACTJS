import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const getMentors = () => api.get('/mentors');
export const deleteMentor = (id) => api.delete(`/mentors/${id}`);
export const approveMentor = (id) => api.put(`/mentors/${id}/approve`);

export default {
  getMentors,
  deleteMentor,
  approveMentor,
};
