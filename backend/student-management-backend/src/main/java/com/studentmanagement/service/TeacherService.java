package com.studentmanagement.service;

import com.studentmanagement.entity.Teacher;
import com.studentmanagement.repository.TeacherRepository;
import org.springframework.stereotype.Service;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;

    public TeacherService(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    public Teacher login(String teacherCode, String password) {

        Teacher teacher = teacherRepository.findByTeacherCode(teacherCode);

        if (teacher != null &&
                teacher.getPasswordHash().equals(password)) {
            return teacher;
        }

        return null;
    }
}