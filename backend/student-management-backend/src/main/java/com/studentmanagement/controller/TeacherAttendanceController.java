package com.studentmanagement.controller;

import com.studentmanagement.entity.Attendance;
import com.studentmanagement.service.TeacherAttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher-attendance")
public class TeacherAttendanceController {

    private final TeacherAttendanceService teacherAttendanceService;

    public TeacherAttendanceController(TeacherAttendanceService teacherAttendanceService) {
        this.teacherAttendanceService = teacherAttendanceService;
    }

    @GetMapping("/teacher/{teacherId}/course/{courseId}")
    public ResponseEntity<List<Attendance>> getAttendance(
            @PathVariable Integer teacherId,
            @PathVariable Integer courseId) {
        return ResponseEntity.ok(teacherAttendanceService.getAttendance(teacherId, courseId));
    }

    @PostMapping("/teacher/{teacherId}/course/{courseId}/student/{studentId}")
    public ResponseEntity<Attendance> addAttendance(
            @PathVariable Integer teacherId,
            @PathVariable Integer courseId,
            @PathVariable Integer studentId,
            @RequestBody Attendance data) {
        return ResponseEntity.status(201).body(
                teacherAttendanceService.addAttendance(teacherId, courseId, studentId, data)
        );
    }

    @PutMapping("/teacher/{teacherId}/course/{courseId}/student/{studentId}")
    public ResponseEntity<Attendance> updateAttendance(
            @PathVariable Integer teacherId,
            @PathVariable Integer courseId,
            @PathVariable Integer studentId,
            @RequestBody Attendance data) {
        return ResponseEntity.ok(
                teacherAttendanceService.updateAttendance(teacherId, courseId, studentId, data)
        );
    }

    @DeleteMapping("/teacher/{teacherId}/course/{courseId}/student/{studentId}")
    public ResponseEntity<Map<String, Object>> deleteAttendance(
            @PathVariable Integer teacherId,
            @PathVariable Integer courseId,
            @PathVariable Integer studentId) {
        teacherAttendanceService.deleteAttendance(teacherId, courseId, studentId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Attendance deleted successfully"));
    }
}
