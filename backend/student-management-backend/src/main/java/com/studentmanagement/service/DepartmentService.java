package com.studentmanagement.service;

import com.studentmanagement.entity.Department;
import com.studentmanagement.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Optional<Department> getDepartmentByCode(String departmentCode) {
        return departmentRepository.findByDepartmentCode(departmentCode);
    }

    public Department getDepartmentById(Integer departmentId) {
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));
    }

    public Department createDepartment(String departmentCode, String departmentName) {
        if (departmentCode == null || departmentCode.trim().isEmpty()) {
            throw new RuntimeException("Department code is required");
        }
        if (departmentName == null || departmentName.trim().isEmpty()) {
            throw new RuntimeException("Department name is required");
        }
        if (departmentRepository.findByDepartmentCode(departmentCode.trim()).isPresent()) {
            throw new RuntimeException("Department with this code already exists");
        }
        if (departmentRepository.findByDepartmentName(departmentName.trim()).isPresent()) {
            throw new RuntimeException("Department with this name already exists");
        }

        Department dept = new Department();
        dept.setDepartmentCode(departmentCode.trim());
        dept.setDepartmentName(departmentName.trim());
        return departmentRepository.save(dept);
    }

    public Department updateDepartment(Integer departmentId, String departmentCode, String departmentName) {
        Department dept = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        if (departmentCode == null || departmentCode.trim().isEmpty()) {
            throw new RuntimeException("Department code is required");
        }
        if (departmentName == null || departmentName.trim().isEmpty()) {
            throw new RuntimeException("Department name is required");
        }

        Optional<Department> codeCheck = departmentRepository.findByDepartmentCode(departmentCode.trim());
        if (codeCheck.isPresent() && !codeCheck.get().getDepartmentId().equals(departmentId)) {
            throw new RuntimeException("Department with this code already exists");
        }

        Optional<Department> nameCheck = departmentRepository.findByDepartmentName(departmentName.trim());
        if (nameCheck.isPresent() && !nameCheck.get().getDepartmentId().equals(departmentId)) {
            throw new RuntimeException("Department with this name already exists");
        }

        dept.setDepartmentCode(departmentCode.trim());
        dept.setDepartmentName(departmentName.trim());
        return departmentRepository.save(dept);
    }

    public void deleteDepartment(Integer departmentId) {
        Department dept = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        try {
            departmentRepository.delete(dept);
        } catch (Exception e) {
            throw new RuntimeException("Cannot delete department — it still has associated courses.");
        }
    }
}