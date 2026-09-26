package com.studentmanagement.service;

import com.studentmanagement.entity.Course;
import com.studentmanagement.entity.Enrollment;
import com.studentmanagement.entity.Student;
import com.studentmanagement.entity.TeacherCourse;
import com.studentmanagement.repository.CourseRepository;
import com.studentmanagement.repository.EnrollmentRepository;
import com.studentmanagement.repository.StudentRepository;
import com.studentmanagement.repository.TeacherCourseRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TeacherEnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final TeacherCourseRepository teacherCourseRepository;

    public TeacherEnrollmentService(
            EnrollmentRepository enrollmentRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository,
            TeacherCourseRepository teacherCourseRepository) {

        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.teacherCourseRepository = teacherCourseRepository;
    }


    /*
     * Check whether a course belongs to the teacher.
     */
    private boolean isCourseAssignedToTeacher(
            Integer teacherId,
            Integer courseId) {

        return teacherCourseRepository
                .findByTeacherTeacherId(teacherId)
                .stream()
                .anyMatch(
                        teacherCourse ->
                                teacherCourse
                                        .getCourse()
                                        .getCourseId()
                                        .equals(courseId)
                );
    }


    /*
     * Get students enrolled in a teacher's course.
     */
    public List<Map<String, Object>>
    getEnrolledStudents(
            Integer teacherId,
            Integer courseId) {

        if (!isCourseAssignedToTeacher(
                teacherId,
                courseId)) {

            throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            "Teacher is not assigned to this course"
            );
        }

        List<Enrollment> enrollments =
                enrollmentRepository
                        .findByCourseCourseId(courseId);

        List<Map<String, Object>> students =
                new ArrayList<>();

        for (Enrollment enrollment : enrollments) {

            Student student =
                    enrollment.getStudent();

            Map<String, Object> studentData =
                    new LinkedHashMap<>();

            studentData.put(
                    "studentId",
                    student.getStudentId()
            );

            studentData.put(
                    "registerNumber",
                    student.getRegisterNumber()
            );

            studentData.put(
                    "name",
                    student.getName()
            );

            students.add(studentData);
        }

        return students;
    }


    /*
     * Enroll a student into a teacher's course.
     */
    public Map<String, Object>
    enrollStudent(
            Integer teacherId,
            Integer courseId,
            Integer studentId) {

        if (!isCourseAssignedToTeacher(
                teacherId,
                courseId)) {

            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Teacher is not assigned to this course"
            );
        }

        Student student =
                studentRepository
                        .findById(studentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"
                                )
                        );

        Course course =
                courseRepository
                        .findById(courseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course not found"
                                )
                        );


        boolean alreadyEnrolled =
                enrollmentRepository
                        .findByStudentStudentIdAndCourseCourseId(
                                studentId,
                                courseId
                        )
                        .isPresent();

        if (alreadyEnrolled) {

            throw new RuntimeException(
                    "Student is already enrolled in this course"
            );
        }


        Enrollment enrollment =
                new Enrollment();

        enrollment.setStudent(student);
        enrollment.setCourse(course);

        Enrollment savedEnrollment =
                enrollmentRepository.save(enrollment);


        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "message",
                "Student enrolled successfully"
        );

        response.put(
                "enrollmentId",
                savedEnrollment.getEnrollmentId()
        );

        response.put(
                "studentId",
                student.getStudentId()
        );

        response.put(
                "registerNumber",
                student.getRegisterNumber()
        );

        response.put(
                "studentName",
                student.getName()
        );

        response.put(
                "courseId",
                course.getCourseId()
        );

        response.put(
                "courseCode",
                course.getCourseCode()
        );

        return response;
    }


    /*
     * Remove a student from a teacher's course.
     */
    public Map<String, Object>
    removeStudent(
            Integer teacherId,
            Integer courseId,
            Integer studentId) {

        if (!isCourseAssignedToTeacher(
                teacherId,
                courseId)) {
            throw new ResponseStatusException(
                 HttpStatus.FORBIDDEN,
                "Teacher is not assigned to this course"
            );
        }


        Enrollment enrollment =
                enrollmentRepository
                        .findByStudentStudentIdAndCourseCourseId(
                                studentId,
                                courseId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student is not enrolled in this course"
                                )
                        );


        enrollmentRepository.delete(enrollment);


        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "message",
                "Student removed from course successfully"
        );

        response.put(
                "studentId",
                studentId
        );

        response.put(
                "courseId",
                courseId
        );

        return response;
    }
    public List<Map<String, Object>> getAvailableStudents(
        Integer teacherId,
        Integer courseId) {

    if (!isCourseAssignedToTeacher(teacherId, courseId)) {
        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Teacher is not assigned to this course"
        );
    }

    List<Enrollment> enrollments =
            enrollmentRepository.findByCourseCourseId(courseId);

    java.util.Set<Integer> enrolledStudentIds =
            enrollments.stream()
                    .map(enrollment ->
                            enrollment.getStudent().getStudentId())
                    .collect(java.util.stream.Collectors.toSet());

    List<Student> allStudents =
            studentRepository.findAll();

    List<Map<String, Object>> availableStudents =
            new ArrayList<>();

    for (Student student : allStudents) {

        if (enrolledStudentIds.contains(student.getStudentId())) {
            continue;
        }

        Map<String, Object> studentData =
                new LinkedHashMap<>();

        studentData.put(
                "studentId",
                student.getStudentId()
        );

        studentData.put(
                "registerNumber",
                student.getRegisterNumber()
        );

        studentData.put(
                "name",
                student.getName()
        );

        availableStudents.add(studentData);
    }

    return availableStudents;
}
}