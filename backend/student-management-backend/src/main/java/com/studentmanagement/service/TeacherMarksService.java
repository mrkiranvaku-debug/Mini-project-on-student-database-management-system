package com.studentmanagement.service;

import com.studentmanagement.entity.Course;
import com.studentmanagement.entity.Enrollment;
import com.studentmanagement.entity.Marks;
import com.studentmanagement.entity.Student;
import com.studentmanagement.repository.CourseRepository;
import com.studentmanagement.repository.EnrollmentRepository;
import com.studentmanagement.repository.MarksRepository;
import com.studentmanagement.repository.StudentRepository;
import com.studentmanagement.repository.TeacherCourseRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TeacherMarksService {

    private final MarksRepository marksRepository;
    private final TeacherCourseRepository teacherCourseRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public TeacherMarksService(
            MarksRepository marksRepository,
            TeacherCourseRepository teacherCourseRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository) {
        this.marksRepository = marksRepository;
        this.teacherCourseRepository = teacherCourseRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public List<Marks> getMarks(Integer teacherId, Integer courseId) {
        verifyTeacherCourse(teacherId, courseId);
        return marksRepository.findByCourseCourseId(courseId);
    }

    public Marks addMarks(Integer teacherId, Integer courseId, Integer studentId, Marks marksData) {
        verifyTeacherCourse(teacherId, courseId);
        verifyStudentEnrolled(studentId, courseId);

        Marks existingMarks = marksRepository.findByStudentStudentIdAndCourseCourseId(studentId, courseId);
        if (existingMarks != null) {
            throw new RuntimeException("Marks already exists for this student in this course.");
        }

        Student student = studentRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));

        Marks newMarks = new Marks();
        newMarks.setStudent(student);
        newMarks.setCourse(course);
        
        updateMarksData(newMarks, marksData);
        
        return marksRepository.save(newMarks);
    }

    public Marks updateMarks(Integer teacherId, Integer courseId, Integer studentId, Marks marksData) {
        verifyTeacherCourse(teacherId, courseId);
        
        Marks existingMarks = marksRepository.findByStudentStudentIdAndCourseCourseId(studentId, courseId);
        if (existingMarks == null) {
            throw new RuntimeException("Marks record not found.");
        }

        updateMarksData(existingMarks, marksData);
        
        return marksRepository.save(existingMarks);
    }

    public void deleteMarks(Integer teacherId, Integer courseId, Integer studentId) {
        verifyTeacherCourse(teacherId, courseId);
        
        Marks existingMarks = marksRepository.findByStudentStudentIdAndCourseCourseId(studentId, courseId);
        if (existingMarks == null) {
            throw new RuntimeException("Marks record not found.");
        }

        marksRepository.delete(existingMarks);
    }

    private void updateMarksData(Marks target, Marks source) {
        if (source.getInternalMarks() == null || source.getInternalMarks().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Invalid internal marks");
        }
        if (source.getExternalMarks() == null || source.getExternalMarks().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Invalid external marks");
        }
        
        BigDecimal total = source.getInternalMarks().add(source.getExternalMarks());
        if (total.compareTo(new BigDecimal("100")) > 0) {
            throw new RuntimeException("Total marks cannot exceed 100");
        }
        
        target.setInternalMarks(source.getInternalMarks());
        target.setExternalMarks(source.getExternalMarks());
        target.setTotalMarks(total);

        // Grade calculation (simplified example)
        String grade;
        BigDecimal gp;
        if (total.compareTo(new BigDecimal("90")) >= 0) { grade = "S"; gp = new BigDecimal("10"); }
        else if (total.compareTo(new BigDecimal("80")) >= 0) { grade = "A"; gp = new BigDecimal("9"); }
        else if (total.compareTo(new BigDecimal("70")) >= 0) { grade = "B"; gp = new BigDecimal("8"); }
        else if (total.compareTo(new BigDecimal("60")) >= 0) { grade = "C"; gp = new BigDecimal("7"); }
        else if (total.compareTo(new BigDecimal("50")) >= 0) { grade = "D"; gp = new BigDecimal("6"); }
        else { grade = "F"; gp = new BigDecimal("0"); }

        target.setGrade(grade);
        target.setGradePoint(gp);
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
