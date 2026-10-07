package com.studentmanagement.service;

import com.studentmanagement.entity.Course;
import com.studentmanagement.entity.Department;
import com.studentmanagement.repository.CourseRepository;
import com.studentmanagement.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;

    public CourseService(CourseRepository courseRepository, DepartmentRepository departmentRepository) {
        this.courseRepository = courseRepository;
        this.departmentRepository = departmentRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseByCode(String courseCode) {
        return courseRepository.findByCourseCode(courseCode);
    }

    public Course getCourseById(Integer courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public Course createCourse(String courseCode, String courseName, Integer credits, Integer departmentId) {
        if (courseCode == null || courseCode.trim().isEmpty()) {
            throw new RuntimeException("Course code is required");
        }
        if (courseName == null || courseName.trim().isEmpty()) {
            throw new RuntimeException("Course name is required");
        }
        if (credits == null || credits <= 0) {
            throw new RuntimeException("Credits must be greater than 0");
        }
        if (departmentId == null) {
            throw new RuntimeException("Department is required");
        }
        if (courseRepository.findByCourseCode(courseCode.trim()).isPresent()) {
            throw new RuntimeException("Course with this code already exists");
        }

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Course course = new Course();
        course.setCourseCode(courseCode.trim());
        course.setCourseName(courseName.trim());
        course.setCredits(credits);
        course.setDepartment(department);

        return courseRepository.save(course);
    }

    public Course updateCourse(Integer courseId, String courseCode, String courseName, Integer credits, Integer departmentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (courseCode == null || courseCode.trim().isEmpty()) {
            throw new RuntimeException("Course code is required");
        }
        if (courseName == null || courseName.trim().isEmpty()) {
            throw new RuntimeException("Course name is required");
        }
        if (credits == null || credits <= 0) {
            throw new RuntimeException("Credits must be greater than 0");
        }
        if (departmentId == null) {
            throw new RuntimeException("Department is required");
        }

        Optional<Course> existing = courseRepository.findByCourseCode(courseCode.trim());
        if (existing.isPresent() && !existing.get().getCourseId().equals(courseId)) {
            throw new RuntimeException("Course with this code already exists");
        }

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        course.setCourseCode(courseCode.trim());
        course.setCourseName(courseName.trim());
        course.setCredits(credits);
        course.setDepartment(department);

        return courseRepository.save(course);
    }

    public void deleteCourse(Integer courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        try {
            courseRepository.delete(course);
        } catch (Exception e) {
            throw new RuntimeException("Cannot delete course — it still has associated enrollments, marks, or assignments.");
        }
    }
}