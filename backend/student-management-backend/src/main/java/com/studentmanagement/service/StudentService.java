package com.studentmanagement.service;

import com.studentmanagement.entity.Student;
import com.studentmanagement.repository.StudentRepository;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student login(String registerNumber, String password) {

        Student student = studentRepository.findByRegisterNumber(registerNumber);

        if (student != null && student.getPasswordHash().equals(password)) {
            return student;
        }

        return null;
    }
}
