import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/DateRangeFilter.css';

const DateRangeFilter = ({ onFilter }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  // Convert YYYY-MM-DD to MM/DD/YYYY
  const formatToBackendDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
  };

  const handleFilter = () => {
    if (!startDate || !endDate) {
      setError('Please select both dates');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      setError('End date must be after start date');
      return;
    }

    setError('');
    // Convert dates before passing to parent
    onFilter(
      formatToBackendDate(startDate),
      formatToBackendDate(endDate)
    );
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setError('');
    onFilter('', '');
  };

  return (
    <div className="date-range-filter">
      <h3 class="filtertitle">Filter by Hire Date</h3>
      {error && <div className="error-message">{error}</div>}
      <div className="filter-controls">
        <div className="date-input">
          <label htmlFor="startDate">From:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="date-input">
          <label htmlFor="endDate">To:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button type="button" onClick={handleFilter} className="filter-btn">
            Apply Filter
          </button>
          <button type="button" onClick={handleClear} className="clear-btn">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

DateRangeFilter.propTypes = {
  onFilter: PropTypes.func.isRequired
};

export default DateRangeFilter;