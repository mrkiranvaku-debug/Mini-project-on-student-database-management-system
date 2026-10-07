package com.studentmanagement.controller;

import com.studentmanagement.entity.Department;
import com.studentmanagement.service.DepartmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @GetMapping("/{departmentCode}")
    public ResponseEntity<Department> getDepartmentByCode(@PathVariable String departmentCode) {
        return departmentService.getDepartmentByCode(departmentCode)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Department> createDepartment(@RequestBody Map<String, String> request) {
        String code = request.get("departmentCode");
        String name = request.get("departmentName");
        return ResponseEntity.status(201).body(departmentService.createDepartment(code, name));
    }

    @PutMapping("/{departmentId}")
    public ResponseEntity<Department> updateDepartment(
            @PathVariable Integer departmentId,
            @RequestBody Map<String, String> request) {
        String code = request.get("departmentCode");
        String name = request.get("departmentName");
        return ResponseEntity.ok(departmentService.updateDepartment(departmentId, code, name));
    }

    @DeleteMapping("/{departmentId}")
    public ResponseEntity<Map<String, Object>> deleteDepartment(@PathVariable Integer departmentId) {
        departmentService.deleteDepartment(departmentId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Department deleted successfully"));
    }
}