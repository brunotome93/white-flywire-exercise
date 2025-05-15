# Employee Management System


## Overview
This is a full-stack application for managing company employee information, featuring:
- Spring Boot backend with REST API
- React frontend
- Persistent data storage in JSON format

## Key Features
### Backend API Endpoints
#### 1. Employee Management
- GET /api/employees/active - List all active employees (sorted by last name)

- GET /api/employees/{id} - Get employee details with direct reports

- POST /api/employees - Create new employee

- PUT /api/employees/{id}/deactivate - Deactivate employee
#### 2. Advanced Filters
- GET /api/employees/hired-between - Filter by hire date range

### Frontend Components
- Employee listing with sorting/filtering

- Employee detail view

- Add new employee form

- Date range filtering

## Data Persistence
The system uses a dual-path data storage approach:
### 1. Original Template (read-only)

- Location: src/main/resources/data.json

- Serves as initial data template

- Never modified by the application

### 2. Runtime Data File (read-write)

- Default location: target/classes/data.json

- All runtime modifications go here

- Automatically created if missing

## Installation
### Prerequisites
- Java 11+

- Node.js 14+

- Maven
### Backend Setup
#### 1. Build the application:
```bash
mvn clean package
```
#### 2. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

### Frontend Setup
#### 1. Install dependencies:
```bash
npm install
```
#### 2. Start development server:
```bash
npm start
```

## Troubleshooting
### Issue: Changes not persisting

- Verify write permissions on data directory

- Check application logs for file operations

- Confirm correct data file path in logs

### Issue: API returns 404

- Ensure backend is running on correct port

- Verify endpoint URLs match your API version