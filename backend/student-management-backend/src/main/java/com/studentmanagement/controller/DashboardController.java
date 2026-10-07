package com.studentmanagement.controller;

import com.studentmanagement.dto.StudentDashboardResponse;
import com.studentmanagement.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<StudentDashboardResponse> getStudentDashboard(
            @PathVariable Integer studentId) {

        return ResponseEntity.ok(
                dashboardService.getStudentDashboard(studentId)
        );
    }
}