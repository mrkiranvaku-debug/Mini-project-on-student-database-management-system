package com.studentmanagement.controller;

import com.studentmanagement.service.TeacherStudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher-students")
public class TeacherStudentController {

    private final TeacherStudentService teacherStudentService;

    public TeacherStudentController(
            TeacherStudentService teacherStudentService) {

        this.teacherStudentService =
                teacherStudentService;
    }


    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Map<String, Object>>>
    getStudentsByTeacher(
            @PathVariable Integer teacherId) {

        return ResponseEntity.ok(
                teacherStudentService
                        .getStudentsByTeacher(teacherId)
        );
    }


    @GetMapping("/{studentId}")
    public ResponseEntity<Map<String, Object>>
    getStudent(
            @RequestParam Integer teacherId,
            @PathVariable Integer studentId) {

        return ResponseEntity.ok(
                teacherStudentService.getStudentByTeacher(
                        teacherId,
                        studentId
                )
        );
    }


    @PutMapping("/{studentId}")
    public ResponseEntity<Map<String, Object>>
    updateStudent(
            @RequestParam Integer teacherId,
            @PathVariable Integer studentId,
            @RequestBody Map<String, String> request) {

        String registerNumber =
                request.get("registerNumber");

        String name =
                request.get("name");


        return ResponseEntity.ok(
                teacherStudentService.updateStudent(
                        teacherId,
                        studentId,
                        registerNumber,
                        name
                )
        );
    }
}