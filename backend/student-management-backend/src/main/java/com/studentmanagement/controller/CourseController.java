package com.studentmanagement.controller;

import com.studentmanagement.entity.Course;
import com.studentmanagement.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(
                courseService.getAllCourses()
        );
    }

    @GetMapping("/{courseCode}")
    public ResponseEntity<Course> getCourseByCode(
            @PathVariable String courseCode) {

        return courseService
                .getCourseByCode(courseCode)
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity.notFound().build()
                );
    }
}