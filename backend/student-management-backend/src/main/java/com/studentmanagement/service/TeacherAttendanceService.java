package com.studentmanagement.service;

import com.studentmanagement.entity.Attendance;
import com.studentmanagement.entity.Course;
import com.studentmanagement.entity.Student;
import com.studentmanagement.repository.AttendanceRepository;
import com.studentmanagement.repository.CourseRepository;
import com.studentmanagement.repository.EnrollmentRepository;
import com.studentmanagement.repository.StudentRepository;
import com.studentmanagement.repository.TeacherCourseRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class TeacherAttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final TeacherCourseRepository teacherCourseRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public TeacherAttendanceService(
            AttendanceRepository attendanceRepository,
            TeacherCourseRepository teacherCourseRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.teacherCourseRepository = teacherCourseRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public List<Attendance> getAttendance(Integer teacherId, Integer courseId) {
        verifyTeacherCourse(teacherId, courseId);
        return attendanceRepository.findByCourseCourseId(courseId);
    }

    public Attendance addAttendance(Integer teacherId, Integer courseId, Integer studentId, Attendance data) {
        verifyTeacherCourse(teacherId, courseId);
        verifyStudentEnrolled(studentId, courseId);

        Attendance existing = attendanceRepository.findByStudentStudentIdAndCourseCourseId(studentId, courseId);
        if (existing != null) {
            throw new RuntimeException("Attendance record already exists for this student in this course.");
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setCourse(course);
        applyAttendanceData(attendance, data);

        return attendanceRepository.save(attendance);
    }

    public Attendance updateAttendance(Integer teacherId, Integer courseId, Integer studentId, Attendance data) {
        verifyTeacherCourse(teacherId, courseId);

        Attendance existing = attendanceRepository.findByStudentStudentIdAndCourseCourseId(studentId, courseId);
        if (existing == null) {
            throw new RuntimeException("Attendance record not found.");
        }

        applyAttendanceData(existing, data);
        return attendanceRepository.save(existing);
    }

    public void deleteAttendance(Integer teacherId, Integer courseId, Integer studentId) {
        verifyTeacherCourse(teacherId, courseId);

        Attendance existing = attendanceRepository.findByStudentStudentIdAndCourseCourseId(studentId, courseId);
        if (existing == null) {
            throw new RuntimeException("Attendance record not found.");
        }
        attendanceRepository.delete(existing);
    }

    private void applyAttendanceData(Attendance target, Attendance source) {
        Integer held = source.getClassesHeld();
        Integer attended = source.getClassesAttended();

        if (held == null || held < 0) {
            throw new RuntimeException("Classes held cannot be negative");
        }
        if (attended == null || attended < 0) {
            throw new RuntimeException("Classes attended cannot be negative");
        }
        if (attended > held) {
            throw new RuntimeException("Classes attended cannot exceed classes held");
        }

        target.setClassesHeld(held);
        target.setClassesAttended(attended);

        BigDecimal percentage = held == 0
                ? BigDecimal.ZERO
                : new BigDecimal(attended * 100).divide(new BigDecimal(held), 2, RoundingMode.HALF_UP);

        target.setAttendancePercentage(percentage);
    }

    private void verifyTeacherCourse(Integer teacherId, Integer courseId) {
        boolean assigned = teacherCourseRepository.findByTeacherTeacherId(teacherId).stream()
                .anyMatch(tc -> tc.getCourse().getCourseId().equals(courseId));
        if (!assigned) {
            throw new RuntimeException("Teacher is not assigned to this course");
        }
    }

    private void verifyStudentEnrolled(Integer studentId, Integer courseId) {
        boolean enrolled = enrollmentRepository.findByCourseCourseId(courseId).stream()
                .anyMatch(e -> e.getStudent().getStudentId().equals(studentId));
        if (!enrolled) {
            throw new RuntimeException("Student is not enrolled in this course");
        }
    }
}
