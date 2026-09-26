package com.studentmanagement.repository;

import com.studentmanagement.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {

    List<Enrollment> findByStudentStudentId(Integer studentId);

    List<Enrollment> findByCourseCourseId(Integer courseId);
}