package com.studentmanagement.controller;

import com.studentmanagement.dto.TeacherDashboardResponse;
import com.studentmanagement.service.TeacherDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teacher-dashboard")
public class TeacherDashboardController {

    private final TeacherDashboardService teacherDashboardService;

    public TeacherDashboardController(
            TeacherDashboardService teacherDashboardService) {

        this.teacherDashboardService =
                teacherDashboardService;
    }


    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<TeacherDashboardResponse>
    getTeacherDashboard(
            @PathVariable Integer teacherId) {

        return ResponseEntity.ok(
                teacherDashboardService
                        .getTeacherDashboard(teacherId)
        );
    }
}