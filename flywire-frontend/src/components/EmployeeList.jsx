import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import DateRangeFilter from './DateRangeFilter';
import '../styles/EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.getActiveEmployees();
      setEmployees(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = async (start, end) => {
    try {
      setLoading(true);
      setError('');

      if (!start || !end) {
        const response = await api.getActiveEmployees();
        setEmployees(response.data);
        return;
      }

      const response = await api.getEmployeesByHireDate(start, end);
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to filter employees. Please try again.');
      console.error('Filter error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deactivateEmployee = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this employee?')) {
      try {
        await api.deactivateEmployee(id);
        fetchEmployees();
      } catch (err) {
        setError('Failed to deactivate employee.');
      }
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedEmployees = useMemo(() => {
    if (!sortConfig.key) return employees;

    return [...employees].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Handle date parsing for hireDate
      if (sortConfig.key === 'hireDate') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [employees, sortConfig]);

  if (loading) return <div className="loading">Loading employees...</div>;

  const getSortArrow = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div className="employee-list">
      <h1>Active Employees</h1>

      <DateRangeFilter onFilter={handleDateFilter} />

      {error && <div className="error">{error}</div>}

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>
              Name{getSortArrow('name')}
            </th>
            <th onClick={() => handleSort('position')}>
              Position{getSortArrow('position')}
            </th>
            <th onClick={() => handleSort('hireDate')}>
              Hire Date{getSortArrow('hireDate')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedEmployees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
              <td>{new Date(employee.hireDate).toLocaleDateString()}</td>
              <td>
                <button onClick={() => navigate(`/employee/${employee.id}`)}>
                  View
                </button>
                <button
                  onClick={() => deactivateEmployee(employee.id)}
                  className="deactivate-btn"
                >
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => navigate('/add-employee')}
        className="add-employee-btn"
      >
        Add New Employee
      </button>
    </div>
  );
};

export default EmployeeList;
