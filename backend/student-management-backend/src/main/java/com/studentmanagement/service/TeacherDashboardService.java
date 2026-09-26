package com.studentmanagement.service;

import com.studentmanagement.dto.TeacherDashboardResponse;
import com.studentmanagement.entity.Enrollment;
import com.studentmanagement.entity.Teacher;
import com.studentmanagement.entity.TeacherCourse;
import com.studentmanagement.repository.EnrollmentRepository;
import com.studentmanagement.repository.TeacherCourseRepository;
import com.studentmanagement.repository.TeacherRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class TeacherDashboardService {

    private final TeacherRepository teacherRepository;
    private final TeacherCourseRepository teacherCourseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public TeacherDashboardService(
            TeacherRepository teacherRepository,
            TeacherCourseRepository teacherCourseRepository,
            EnrollmentRepository enrollmentRepository) {

        this.teacherRepository = teacherRepository;
        this.teacherCourseRepository = teacherCourseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }


    public TeacherDashboardResponse getTeacherDashboard(
            Integer teacherId) {

        Teacher teacher = teacherRepository
                .findById(teacherId)
                .orElseThrow(() ->
                        new RuntimeException("Teacher not found"));


        List<TeacherCourse> assignments =
                teacherCourseRepository
                        .findByTeacherTeacherId(teacherId);


        TeacherDashboardResponse response =
                new TeacherDashboardResponse();

        response.setTeacherId(teacher.getTeacherId());
        response.setTeacherCode(teacher.getTeacherCode());
        response.setTeacherName(teacher.getName());

        response.setTotalSubjects(assignments.size());


        List<TeacherDashboardResponse.SubjectSummary> subjects =
                new ArrayList<>();


        int totalEnrollments = 0;

        Set<Integer> uniqueStudentIds = new HashSet<>();


        for (TeacherCourse assignment : assignments) {

            Integer courseId =
                    assignment.getCourse().getCourseId();


            List<Enrollment> enrollments =
                    enrollmentRepository
                            .findByCourseCourseId(courseId);


            totalEnrollments += enrollments.size();


            for (Enrollment enrollment : enrollments) {

                if (enrollment.getStudent() != null) {

                    uniqueStudentIds.add(
                            enrollment.getStudent().getStudentId()
                    );
                }
            }


            TeacherDashboardResponse.SubjectSummary subject =
                    new TeacherDashboardResponse.SubjectSummary();

            subject.setCourseId(
                    assignment.getCourse().getCourseId()
            );

            subject.setCourseCode(
                    assignment.getCourse().getCourseCode()
            );

            subject.setCourseName(
                    assignment.getCourse().getCourseName()
            );

            subject.setCredits(
                    assignment.getCourse().getCredits()
            );

            subject.setStudentCount(
                    enrollments.size()
            );


            subjects.add(subject);
        }


        response.setTotalEnrollments(totalEnrollments);

        response.setTotalStudents(uniqueStudentIds.size());

        response.setSubjects(subjects);


        return response;
    }
}