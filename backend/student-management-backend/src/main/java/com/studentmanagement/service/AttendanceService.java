package com.studentmanagement.service;

import com.studentmanagement.entity.Attendance;
import com.studentmanagement.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public List<Attendance> getAttendanceByStudent(Integer studentId) {
        return attendanceRepository.findByStudentStudentId(studentId);
    }

    public List<Attendance> getAttendanceByCourse(Integer courseId) {
        return attendanceRepository.findByCourseCourseId(courseId);
    }
}
