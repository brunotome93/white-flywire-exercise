import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/EmployeeDetail.css';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [directReports, setDirectReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const response = await api.getEmployee(id);
        setEmployee(response.data.employee);
        setDirectReports(response.data.directReports);
        setError('');
      } catch (err) {
        setError('Failed to load employee details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) return <div className="loading">Loading employee details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!employee) return <div className="error">Employee not found</div>;

  return (
    <div className="employee-detail">
      <h1>{employee.name}</h1>
      <div className="employee-info">
        <p><strong>Position:</strong> {employee.position}</p>
        <p><strong>Hire Date:</strong> {new Date(employee.hireDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {employee.active ? 'Active' : 'Inactive'}</p>
      </div>
      
      <div className="direct-reports">
        <h3>Direct Reports</h3>
        {directReports.length > 0 ? (
          <ul>
            {directReports.map((report, index) => (
              <li key={index}>{report}</li>
            ))}
          </ul>
        ) : (
          <p>No direct reports</p>
        )}
      </div>
      
      <button onClick={() => navigate(-1)}>Back to List</button>
    </div>
  );
};

export default EmployeeDetail;