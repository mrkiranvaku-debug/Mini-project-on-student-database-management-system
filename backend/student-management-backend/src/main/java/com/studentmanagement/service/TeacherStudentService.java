package com.studentmanagement.service;

import com.studentmanagement.entity.Enrollment;
import com.studentmanagement.entity.Student;
import com.studentmanagement.repository.EnrollmentRepository;
import com.studentmanagement.repository.StudentRepository;
import com.studentmanagement.repository.TeacherCourseRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class TeacherStudentService {

    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final TeacherCourseRepository teacherCourseRepository;

    public TeacherStudentService(
            StudentRepository studentRepository,
            EnrollmentRepository enrollmentRepository,
            TeacherCourseRepository teacherCourseRepository) {

        this.studentRepository = studentRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.teacherCourseRepository = teacherCourseRepository;
    }


    public List<Map<String, Object>> getStudentsByTeacher(Integer teacherId) {

        List<Integer> courseIds =
                teacherCourseRepository
                        .findByTeacherTeacherId(teacherId)
                        .stream()
                        .map(tc -> tc.getCourse().getCourseId())
                        .toList();


        if (courseIds.isEmpty()) {
            return List.of();
        }


        Map<Integer, Map<String, Object>> studentMap =
                new LinkedHashMap<>();


        for (Integer courseId : courseIds) {

            List<Enrollment> enrollments =
                    enrollmentRepository
                            .findByCourseCourseId(courseId);


            for (Enrollment enrollment : enrollments) {

                Student student =
                        enrollment.getStudent();

                Integer studentId =
                        student.getStudentId();


                Map<String, Object> studentData =
                        studentMap.computeIfAbsent(
                                studentId,
                                id -> {

                                    Map<String, Object> map =
                                            new LinkedHashMap<>();

                                    map.put(
                                            "studentId",
                                            student.getStudentId()
                                    );

                                    map.put(
                                            "registerNumber",
                                            student.getRegisterNumber()
                                    );

                                    map.put(
                                            "name",
                                            student.getName()
                                    );

                                    map.put(
                                            "courses",
                                            new java.util.ArrayList<>()
                                    );

                                    return map;
                                }
                        );


                @SuppressWarnings("unchecked")
                List<Map<String, Object>> courses =
                        (List<Map<String, Object>>)
                                studentData.get("courses");


                Map<String, Object> courseData =
                        new LinkedHashMap<>();


                courseData.put(
                        "courseId",
                        enrollment.getCourse().getCourseId()
                );

                courseData.put(
                        "courseCode",
                        enrollment.getCourse().getCourseCode()
                );

                courseData.put(
                        "courseName",
                        enrollment.getCourse().getCourseName()
                );


                courses.add(courseData);
            }
        }


        return List.copyOf(studentMap.values());
    }
    public Map<String, Object> getStudentByTeacher(
        Integer teacherId,
        Integer studentId) {

    if (!isTeacherResponsibleForStudent(teacherId, studentId)) {
        throw new RuntimeException(
                "Teacher is not authorized to access this student"
        );
    }

    Student student = studentRepository.findById(studentId)
            .orElseThrow(() ->
                    new RuntimeException("Student not found")
            );

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

    return studentData;
}
public Map<String, Object> updateStudent(
        Integer teacherId,
        Integer studentId,
        String registerNumber,
        String name) {

    if (!isTeacherResponsibleForStudent(teacherId, studentId)) {
        throw new RuntimeException(
                "Teacher is not authorized to update this student"
        );
    }

    Student student = studentRepository.findById(studentId)
            .orElseThrow(() ->
                    new RuntimeException("Student not found")
            );

    if (registerNumber == null ||
            registerNumber.trim().isEmpty()) {

        throw new RuntimeException(
                "Register number cannot be empty"
        );
    }

    if (name == null ||
            name.trim().isEmpty()) {

        throw new RuntimeException(
                "Student name cannot be empty"
        );
    }

    student.setRegisterNumber(
            registerNumber.trim()
    );

    student.setName(
            name.trim()
    );

    Student updatedStudent =
            studentRepository.save(student);

    Map<String, Object> response =
            new LinkedHashMap<>();

    response.put(
            "studentId",
            updatedStudent.getStudentId()
    );

    response.put(
            "registerNumber",
            updatedStudent.getRegisterNumber()
    );

    response.put(
            "name",
            updatedStudent.getName()
    );

    return response;
}
public Map<String, Object> createStudent(
        Integer teacherId,
        String registerNumber,
        String name,
        String password) {

    if (registerNumber == null || registerNumber.trim().isEmpty()) {
        throw new RuntimeException("Register number cannot be empty");
    }

    if (name == null || name.trim().isEmpty()) {
        throw new RuntimeException("Student name cannot be empty");
    }

    if (password == null || password.trim().isEmpty()) {
        throw new RuntimeException("Password cannot be empty");
    }

    if (studentRepository.findByRegisterNumber(registerNumber) != null) {
        throw new RuntimeException("Student with this register number already exists");
    }

    Student student = new Student();
    student.setRegisterNumber(registerNumber.trim());
    student.setName(name.trim());
    student.setPasswordHash(password);

    Student savedStudent = studentRepository.save(student);

    Map<String, Object> response = new LinkedHashMap<>();
    response.put("studentId", savedStudent.getStudentId());
    response.put("registerNumber", savedStudent.getRegisterNumber());
    response.put("name", savedStudent.getName());

    return response;
}

public void deleteStudent(Integer teacherId, Integer studentId) {
    if (!isTeacherResponsibleForStudent(teacherId, studentId)) {
        throw new RuntimeException("Teacher is not authorized to delete this student");
    }
    
    Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));
            
    studentRepository.delete(student);
}

private boolean isTeacherResponsibleForStudent(
        Integer teacherId,
        Integer studentId) {

    List<Integer> courseIds =
            teacherCourseRepository
                    .findByTeacherTeacherId(teacherId)
                    .stream()
                    .map(tc ->
                            tc.getCourse().getCourseId()
                    )
                    .toList();


    if (courseIds.isEmpty()) {
        return false;
    }


    for (Integer courseId : courseIds) {

        List<Enrollment> enrollments =
                enrollmentRepository
                        .findByCourseCourseId(courseId);


        for (Enrollment enrollment : enrollments) {

            if (enrollment.getStudent()
                    .getStudentId()
                    .equals(studentId)) {

                return true;
            }
        }
    }


    return false;
}
}