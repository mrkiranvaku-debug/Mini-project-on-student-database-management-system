package com.studentmanagement.repository;

import com.studentmanagement.entity.Marks;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarksRepository extends JpaRepository<Marks, Integer> {

    List<Marks> findByStudentStudentId(Integer studentId);

    List<Marks> findByCourseCourseId(Integer courseId);
}