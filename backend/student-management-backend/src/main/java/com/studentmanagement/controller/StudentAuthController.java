package com.studentmanagement.controller;

import com.studentmanagement.entity.Student;
import com.studentmanagement.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/student")
public class StudentAuthController {

    private final StudentService studentService;

    public StudentAuthController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {

        String registerNumber = request.get("registerNumber");
        String password = request.get("password");

        Student student = studentService.login(registerNumber, password);

        if (student != null) {
            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message", "Login successful",
                            "student", Map.of(
                                     "studentId", student.getStudentId(),
                                    "registerNumber", student.getRegisterNumber(),
                                    "name", student.getName(),
                                    "role", "STUDENT"
                            )
                    )
            );
        }

        return ResponseEntity.status(401).body(
                Map.of(
                        "success", false,
                        "message", "Invalid register number or password"
                )
        );
    }

}