package com.studentmanagement.repository;

import com.studentmanagement.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {

    List<Attendance> findByStudentStudentId(Integer studentId);

    List<Attendance> findByCourseCourseId(Integer courseId);
}