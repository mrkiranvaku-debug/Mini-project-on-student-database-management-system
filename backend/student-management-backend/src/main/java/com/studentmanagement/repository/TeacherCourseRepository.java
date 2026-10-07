package com.studentmanagement.repository;

import com.studentmanagement.entity.TeacherCourse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeacherCourseRepository
        extends JpaRepository<TeacherCourse, Integer> {

    List<TeacherCourse> findByTeacherTeacherId(Integer teacherId);

    List<TeacherCourse> findByCourseCourseId(Integer courseId);
}