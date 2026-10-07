package com.studentmanagement.controller;

import com.studentmanagement.entity.Course;
import com.studentmanagement.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{courseCode}")
    public ResponseEntity<Course> getCourseByCode(@PathVariable String courseCode) {
        return courseService.getCourseByCode(courseCode)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Map<String, Object> request) {
        String courseCode = (String) request.get("courseCode");
        String courseName = (String) request.get("courseName");
        Integer credits = request.get("credits") != null ? Integer.parseInt(request.get("credits").toString()) : null;
        Integer departmentId = request.get("departmentId") != null ? Integer.parseInt(request.get("departmentId").toString()) : null;

        return ResponseEntity.status(201).body(
                courseService.createCourse(courseCode, courseName, credits, departmentId)
        );
    }

    @PutMapping("/{courseId}")
    public ResponseEntity<Course> updateCourse(
            @PathVariable Integer courseId,
            @RequestBody Map<String, Object> request) {
        String courseCode = (String) request.get("courseCode");
        String courseName = (String) request.get("courseName");
        Integer credits = request.get("credits") != null ? Integer.parseInt(request.get("credits").toString()) : null;
        Integer departmentId = request.get("departmentId") != null ? Integer.parseInt(request.get("departmentId").toString()) : null;

        return ResponseEntity.ok(
                courseService.updateCourse(courseId, courseCode, courseName, credits, departmentId)
        );
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<Map<String, Object>> deleteCourse(@PathVariable Integer courseId) {
        courseService.deleteCourse(courseId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Course deleted successfully"));
    }
}