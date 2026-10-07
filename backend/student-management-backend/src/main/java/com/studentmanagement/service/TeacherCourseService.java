package com.studentmanagement.service;

import com.studentmanagement.entity.TeacherCourse;
import com.studentmanagement.repository.TeacherCourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherCourseService {

    private final TeacherCourseRepository teacherCourseRepository;

    public TeacherCourseService(
            TeacherCourseRepository teacherCourseRepository) {

        this.teacherCourseRepository =
                teacherCourseRepository;
    }

    public List<TeacherCourse> getAllAssignments() {

        return teacherCourseRepository.findAll();
    }

    public List<TeacherCourse> getCoursesByTeacher(
            Integer teacherId) {

        return teacherCourseRepository
                .findByTeacherTeacherId(teacherId);
    }

    public List<TeacherCourse> getTeachersByCourse(
            Integer courseId) {

        return teacherCourseRepository
                .findByCourseCourseId(courseId);
    }
}