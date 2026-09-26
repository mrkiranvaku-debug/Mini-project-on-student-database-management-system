package com.studentmanagement.controller;

import com.studentmanagement.entity.Marks;
import com.studentmanagement.service.MarksService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
public class MarksController {

    private final MarksService marksService;

    public MarksController(MarksService marksService) {
        this.marksService = marksService;
    }

    @GetMapping
    public ResponseEntity<List<Marks>> getAllMarks() {
        return ResponseEntity.ok(
                marksService.getAllMarks()
        );
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Marks>> getMarksByStudent(
            @PathVariable Integer studentId) {

        return ResponseEntity.ok(
                marksService.getMarksByStudent(studentId)
        );
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Marks>> getMarksByCourse(
            @PathVariable Integer courseId) {

        return ResponseEntity.ok(
                marksService.getMarksByCourse(courseId)
        );
    }
}
