package com.studentmanagement.controller;

import com.studentmanagement.entity.Marks;
import com.studentmanagement.service.TeacherMarksService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher-marks")
public class TeacherMarksController {

    private final TeacherMarksService teacherMarksService;

    public TeacherMarksController(TeacherMarksService teacherMarksService) {
        this.teacherMarksService = teacherMarksService;
    }

    @GetMapping("/teacher/{teacherId}/course/{courseId}")
    public ResponseEntity<List<Marks>> getMarks(
            @PathVariable Integer teacherId,
            @PathVariable Integer courseId) {
        return ResponseEntity.ok(teacherMarksService.getMarks(teacherId, courseId));
    }

    @PostMapping("/teacher/{teacherId}/course/{courseId}/student/{studentId}")
    public ResponseEntity<Marks> addMarks(
            @PathVariable Integer teacherId,
            @PathVariable Integer courseId,
            @PathVariable Integer studentId,
            @RequestBody Marks marksData) {
        return ResponseEntity.status(201).body(
                teacherMarksService.addMarks(teacherId, courseId, studentId, marksData)
        );
    }

    @PutMapping("/teacher/{teacherId}/course/{courseId}/student/{studentId}")
    public ResponseEntity<Marks> updateMarks(
            @PathVariable Integer teacherId,
            @PathVariable Integer courseId,
            @PathVariable Integer studentId,
            @RequestBody Marks marksData) {
        return ResponseEntity.ok(
                teacherMarksService.updateMarks(teacherId, courseId, studentId, marksData)
        );
    }

    @DeleteMapping("/teacher/{teacherId}/course/{courseId}/student/{studentId}")
    public ResponseEntity<Map<String, Object>> deleteMarks(
            @PathVariable Integer teacherId,
            @PathVariable Integer courseId,
            @PathVariable Integer studentId) {
        teacherMarksService.deleteMarks(teacherId, courseId, studentId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Marks deleted successfully"));
    }
}
