import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

export default {
  getActiveEmployees: () => api.get('/employees/active'),
  getEmployee: (id) => api.get(`/employees/${id}`),
  getEmployeesByHireDate: (start, end) => api.get('/employees/hired-between', { params: { start, end } }),
  addEmployee: (employee) => api.post('/employees', employee),
  deactivateEmployee: (id) => api.put(`/employees/${id}/deactivate`)
};