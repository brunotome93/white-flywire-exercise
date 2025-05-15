package com.flywire.exercise.controllers;

import com.flywire.exercise.models.Employee;
import com.flywire.exercise.repositories.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    @Autowired
    private EmployeeRepository employeeRepository;

    // 1. Get all active sorted by last name
    @GetMapping("/active")
    public ResponseEntity<?> getActiveEmployees() {
        try {
            return ResponseEntity.ok(employeeRepository.findAllActiveSorted());
        } catch (Exception e) {
            return internalServerError(e);
        }
    }

    // 2. Get employee with direct reports
    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeWithReports(@PathVariable int id) {
        try {
            Map<String, Object> result = employeeRepository.findByIdWithDirectReports(id);
            return result != null 
                ? ResponseEntity.ok(result)
                : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return internalServerError(e);
        }
    }

    // 3. Get by hire date range
    @GetMapping("/hired-between")
    public ResponseEntity<?> getEmployeesHiredBetween(
            @RequestParam @DateTimeFormat(pattern = "MM/dd/yyyy") Date start,
            @RequestParam @DateTimeFormat(pattern = "MM/dd/yyyy") Date end) {
        try {
            return ResponseEntity.ok(employeeRepository.findByHireDateBetween(start, end));
        } catch (Exception e) {
            return internalServerError(e);
        }
    }

    // 4. Create new employee
    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody Employee employee) {
        try {
            return ResponseEntity.ok(employeeRepository.addEmployee(employee));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return internalServerError(e);
        }
    }

    // 5. Deactivate employee
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateEmployee(@PathVariable int id) {
        try {
            return employeeRepository.deactivateEmployee(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return internalServerError(e);
        }
    }

    private ResponseEntity<String> internalServerError(Exception e) {
        return ResponseEntity.internalServerError()
            .body("Error processing request: " + e.getMessage());
    }
}