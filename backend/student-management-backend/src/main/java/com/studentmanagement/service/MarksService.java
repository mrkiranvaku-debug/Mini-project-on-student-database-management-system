package com.studentmanagement.service;

import com.studentmanagement.entity.Marks;
import com.studentmanagement.repository.MarksRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarksService {

    private final MarksRepository marksRepository;

    public MarksService(MarksRepository marksRepository) {
        this.marksRepository = marksRepository;
    }

    public List<Marks> getAllMarks() {
        return marksRepository.findAll();
    }

    public List<Marks> getMarksByStudent(Integer studentId) {
        return marksRepository.findByStudentStudentId(studentId);
    }

    public List<Marks> getMarksByCourse(Integer courseId) {
        return marksRepository.findByCourseCourseId(courseId);
    }
}