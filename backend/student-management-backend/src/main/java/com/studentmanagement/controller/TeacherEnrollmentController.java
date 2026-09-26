package com.studentmanagement.controller;

import com.studentmanagement.service.TeacherEnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher-enrollments")
public class TeacherEnrollmentController {

    private final TeacherEnrollmentService
            teacherEnrollmentService;

    public TeacherEnrollmentController(
            TeacherEnrollmentService teacherEnrollmentService) {

        this.teacherEnrollmentService =
                teacherEnrollmentService;
    }


    /*
     * View students enrolled in a course.
     */
    @GetMapping(
            "/teacher/{teacherId}/course/{courseId}/students"
    )
    public ResponseEntity<List<Map<String, Object>>>
    getEnrolledStudents(
            @PathVariable Integer teacherId,
            @PathVariable Integer courseId) {

        return ResponseEntity.ok(
                teacherEnrollmentService
                        .getEnrolledStudents(
                                teacherId,
                                courseId
                        )
        );
    }


    /*
     * Enroll a student into a course.
     */
    @PostMapping(
            "/teacher/{teacherId}/course/{courseId}/student/{studentId}"
    )
    public ResponseEntity<Map<String, Object>>
    enrollStudent(
            @PathVariable Integer teacherId,
            @PathVariable Integer courseId,
            @PathVariable Integer studentId) {

        return ResponseEntity.ok(
                teacherEnrollmentService
                        .enrollStudent(
                                teacherId,
                                courseId,
                                studentId
                        )
        );
    }


    /*
     * Remove a student from a course.
     */
    @DeleteMapping(
            "/teacher/{teacherId}/course/{courseId}/student/{studentId}"
    )
    public ResponseEntity<Map<String, Object>>
    removeStudent(
            @PathVariable Integer teacherId,
            @PathVariable Integer courseId,
            @PathVariable Integer studentId) {

        return ResponseEntity.ok(
                teacherEnrollmentService
                        .removeStudent(
                                teacherId,
                                courseId,
                                studentId
                        )
        );
    }
    @GetMapping(
        "/teacher/{teacherId}/course/{courseId}/available-students"
)
public ResponseEntity<List<Map<String, Object>>>
getAvailableStudents(
        @PathVariable Integer teacherId,
        @PathVariable Integer courseId) {

    return ResponseEntity.ok(
            teacherEnrollmentService
                    .getAvailableStudents(
                            teacherId,
                            courseId
                    )
    );
}
}