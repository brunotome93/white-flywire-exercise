import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/AddEmployeeForm.css';

const AddEmployeeForm = ({ refreshEmployees }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    position: '',
    hireDate: '',
    active: true,
    directReports: ''
  });
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    // Clear previous errors
    setStatus(prev => ({ ...prev, error: null }));

    // Validate required fields
    if (!formData.id || !formData.name || !formData.position || !formData.hireDate) {
      setStatus(prev => ({ ...prev, error: 'All fields are required' }));
      return false;
    }

    // Validate ID is a number
    if (isNaN(formData.id) || formData.id <= 0) {
      setStatus(prev => ({ ...prev, error: 'ID must be a positive number' }));
      return false;
    }

    // Validate hire date is not in the future
    const today = new Date();
    const hireDate = new Date(formData.hireDate);
    if (hireDate > today) {
      setStatus(prev => ({ ...prev, error: 'Hire date cannot be in the future' }));
      return false;
    }

    return true;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const parseDirectReports = (input) => {
    if (!input.trim()) return [];
    return input
      .split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id) && id > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus({ loading: true, error: null, success: false });

    try {
      const employeeData = {
        ...formData,
        hireDate: formatDate(formData.hireDate),
        directReports: parseDirectReports(formData.directReports)
      };

      await api.addEmployee(employeeData);
      setStatus({ loading: false, error: null, success: true });
      
      // Refresh employee list in parent component
      if (refreshEmployees) refreshEmployees();
      
      // Redirect after success
      setTimeout(() => navigate('/'), 1500);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.response?.data || 
                         'Failed to add employee. Please try again.';
      setStatus({
        loading: false,
        error: errorMessage,
        success: false
      });
    }
  };

  return (
    <div className="add-employee-form">
      <h1>Add New Employee</h1>
      
      {status.success && (
        <div className="alert success">
          <span className="icon">✓</span>
          Employee added successfully! Redirecting...
        </div>
      )}
      
      {status.error && (
        <div className="alert error">
          <span className="icon">!</span>
          {status.error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="id">Employee ID*</label>
            <input
              type="number"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
              min="1"
              className={status.error?.includes('ID') ? 'error' : ''}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="name">Full Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={status.error?.includes('name') ? 'error' : ''}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="position">Position*</label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className={status.error?.includes('Position') ? 'error' : ''}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="hireDate">Hire Date*</label>
            <input
              type="date"
              id="hireDate"
              name="hireDate"
              value={formData.hireDate}
              onChange={handleChange}
              required
              max={new Date().toISOString().split('T')[0]}
              className={status.error?.includes('date') ? 'error' : ''}
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Active Employee
            </label>
          </div>
          
          <div className="form-group">
            <label htmlFor="directReports">Direct Reports (comma separated IDs)</label>
            <input
              type="text"
              id="directReports"
              name="directReports"
              value={formData.directReports}
              onChange={handleChange}
              placeholder="e.g., 101, 205, 307"
            />
            <small>Leave blank if no direct reports</small>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={status.loading}
            className={status.loading ? 'loading' : ''}
          >
            {status.loading ? (
              <>
                <span className="spinner"></span>
                Saving...
              </>
            ) : 'Save Employee'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="cancel-btn"
            disabled={status.loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployeeForm;