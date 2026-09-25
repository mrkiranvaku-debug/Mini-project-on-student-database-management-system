package com.studentmanagement.controller;

import com.studentmanagement.entity.Teacher;
import com.studentmanagement.service.TeacherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/teacher")
public class TeacherAuthController {

    private final TeacherService teacherService;

    public TeacherAuthController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {

        String teacherCode = request.get("teacherCode");
        String password = request.get("password");

        Teacher teacher = teacherService.login(teacherCode, password);

        if (teacher != null) {
            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message", "Login successful",
                            "teacher", Map.of(
                                    "teacherCode", teacher.getTeacherCode(),
                                    "name", teacher.getName(),
                                    "role", "TEACHER"
                            )
                    )
            );
        }

        return ResponseEntity.status(401).body(
                Map.of(
                        "success", false,
                        "message", "Invalid teacher ID or password"
                )
        );
    }
}