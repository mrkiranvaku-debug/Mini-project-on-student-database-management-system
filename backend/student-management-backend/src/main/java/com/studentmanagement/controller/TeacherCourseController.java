package com.studentmanagement.controller;

import com.studentmanagement.entity.TeacherCourse;
import com.studentmanagement.service.TeacherCourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher-courses")
public class TeacherCourseController {

    private final TeacherCourseService teacherCourseService;

    public TeacherCourseController(
            TeacherCourseService teacherCourseService) {

        this.teacherCourseService =
                teacherCourseService;
    }

    @GetMapping
    public ResponseEntity<List<TeacherCourse>>
    getAllAssignments() {

        return ResponseEntity.ok(
                teacherCourseService.getAllAssignments()
        );
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<TeacherCourse>>
    getCoursesByTeacher(
            @PathVariable Integer teacherId) {

        return ResponseEntity.ok(
                teacherCourseService
                        .getCoursesByTeacher(teacherId)
        );
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<TeacherCourse>>
    getTeachersByCourse(
            @PathVariable Integer courseId) {

        return ResponseEntity.ok(
                teacherCourseService
                        .getTeachersByCourse(courseId)
        );
    }
}