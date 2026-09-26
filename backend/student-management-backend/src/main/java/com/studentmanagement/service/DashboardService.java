package com.studentmanagement.service;

import com.studentmanagement.dto.StudentDashboardResponse;
import com.studentmanagement.entity.Attendance;
import com.studentmanagement.entity.Enrollment;
import com.studentmanagement.entity.Marks;
import com.studentmanagement.entity.Student;
import com.studentmanagement.repository.AttendanceRepository;
import com.studentmanagement.repository.EnrollmentRepository;
import com.studentmanagement.repository.MarksRepository;
import com.studentmanagement.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardService {

    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final MarksRepository marksRepository;
    private final AttendanceRepository attendanceRepository;

    public DashboardService(
            StudentRepository studentRepository,
            EnrollmentRepository enrollmentRepository,
            MarksRepository marksRepository,
            AttendanceRepository attendanceRepository) {

        this.studentRepository = studentRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.marksRepository = marksRepository;
        this.attendanceRepository = attendanceRepository;
    }

    public StudentDashboardResponse getStudentDashboard(Integer studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found")
                );

        List<Enrollment> enrollments =
                enrollmentRepository.findByStudentStudentId(studentId);

        List<Marks> marks =
                marksRepository.findByStudentStudentId(studentId);

        List<Attendance> attendance =
                attendanceRepository.findByStudentStudentId(studentId);

        StudentDashboardResponse response =
                new StudentDashboardResponse();

        response.setRegisterNumber(student.getRegisterNumber());
        response.setStudentName(student.getName());

        response.setTotalCourses(enrollments.size());

        response.setCompletedCourses(marks.size());

        response.setGpa(calculateGpa(marks));

        response.setAttendancePercentage(
                calculateAttendance(attendance)
        );

        response.setCourses(
                buildCourseSummaries(enrollments)
        );

        return response;
    }

    private BigDecimal calculateGpa(List<Marks> marks) {

        if (marks.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal totalGradePoints = BigDecimal.ZERO;

        for (Marks mark : marks) {
            totalGradePoints =
                    totalGradePoints.add(mark.getGradePoint());
        }

        return totalGradePoints
                .divide(
                        BigDecimal.valueOf(marks.size()),
                        2,
                        RoundingMode.HALF_UP
                );
    }

    private BigDecimal calculateAttendance(
            List<Attendance> attendance) {

        if (attendance.isEmpty()) {
            return BigDecimal.ZERO;
        }

        int totalClassesHeld = 0;
        int totalClassesAttended = 0;

        for (Attendance record : attendance) {
            totalClassesHeld += record.getClassesHeld();
            totalClassesAttended += record.getClassesAttended();
        }

        if (totalClassesHeld == 0) {
            return BigDecimal.ZERO;
        }

        return BigDecimal.valueOf(totalClassesAttended)
                .multiply(BigDecimal.valueOf(100))
                .divide(
                        BigDecimal.valueOf(totalClassesHeld),
                        2,
                        RoundingMode.HALF_UP
                );
    }

    private List<StudentDashboardResponse.CourseSummary>
    buildCourseSummaries(List<Enrollment> enrollments) {

        List<StudentDashboardResponse.CourseSummary> courses =
                new ArrayList<>();

        for (Enrollment enrollment : enrollments) {

            StudentDashboardResponse.CourseSummary course =
                    new StudentDashboardResponse.CourseSummary();

            course.setCourseCode(
                    enrollment.getCourse().getCourseCode()
            );

            course.setCourseName(
                    enrollment.getCourse().getCourseName()
            );

            course.setCredits(
                    enrollment.getCourse().getCredits()
            );

            courses.add(course);
        }

        return courses;
    }
}