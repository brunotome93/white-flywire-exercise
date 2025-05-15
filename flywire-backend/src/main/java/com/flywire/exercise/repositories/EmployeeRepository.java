package com.flywire.exercise.repositories;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.flywire.exercise.models.Employee;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;

@Repository
public class EmployeeRepository {
    private List<Employee> employees;
    private final ObjectMapper objectMapper;
    private final Path jsonFilePath;

    public EmployeeRepository() throws IOException {
        this.objectMapper = new ObjectMapper();
        this.jsonFilePath = new ClassPathResource("data.json").getFile().toPath();
        loadEmployees();
    }

    private void loadEmployees() throws IOException {
        employees = objectMapper.readValue(
            Files.readAllBytes(jsonFilePath),
            new TypeReference<List<Employee>>(){}
        );
    }

    private synchronized void saveEmployees() throws IOException {
        objectMapper.writerWithDefaultPrettyPrinter()
            .writeValue(jsonFilePath.toFile(), employees);
    }

    // 1. Get all active employees sorted by last name
    public List<Employee> findAllActiveSorted() throws IOException {
        return employees.stream()
            .filter(Employee::isActive)
            .sorted(Comparator.comparing(e -> e.getName().split(" ")[1]))
            .collect(Collectors.toList());
    }

    // 2. Find employee by ID with direct reports
    public Map<String, Object> findByIdWithDirectReports(int id) {
        Optional<Employee> employee = employees.stream()
            .filter(e -> e.getId() == id)
            .findFirst();

        if (employee.isEmpty()) return null;

        Map<String, Object> result = new HashMap<>();
        result.put("employee", employee.get());
        
        List<String> reports = employee.get().getDirectReports().stream()
            .map(reportId -> findById(reportId).map(Employee::getName).orElse("Unknown"))
            .collect(Collectors.toList());
            
        result.put("directReports", reports);
        return result;
    }

    // 3. Find by hire date range
    public List<Employee> findByHireDateBetween(Date start, Date end) {
        return employees.stream()
            .filter(e -> !e.getHireDate().before(start) && !e.getHireDate().after(end))
            .sorted(Comparator.comparing(Employee::getHireDate).reversed())
            .collect(Collectors.toList());
    }

    // 4. Add new employee
    public Employee addEmployee(Employee employee) throws IOException {
        if (findById(employee.getId()).isPresent()) {
            throw new IllegalArgumentException("Employee ID already exists");
        }
        employees.add(employee);
        saveEmployees();
        return employee;
    }

    // 5. Deactivate employee
    public Optional<Employee> deactivateEmployee(int id) throws IOException {
        Optional<Employee> employee = findById(id);
        if (employee.isPresent()) {
            employee.get().setActive(false);
            saveEmployees();
        }
        return employee;
    }

    private Optional<Employee> findById(int id) {
        return employees.stream()
            .filter(e -> e.getId() == id)
            .findFirst();
    }
}