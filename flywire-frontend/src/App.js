import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import EmployeeDetail from './components/EmployeeDetail';
import AddEmployeeForm from './components/AddEmployeeForm';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/add-employee">Add Employee</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/employee/:id" element={<EmployeeDetail />} />
          <Route path="/add-employee" element={<AddEmployeeForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;