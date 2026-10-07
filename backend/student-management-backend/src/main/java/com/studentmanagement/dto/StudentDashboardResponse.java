package com.studentmanagement.dto;

import java.math.BigDecimal;
import java.util.List;

public class StudentDashboardResponse {

    private String registerNumber;
    private String studentName;

    private BigDecimal attendancePercentage;
    private BigDecimal gpa;

    private Integer totalCourses;
    private Integer completedCourses;

    private List<CourseSummary> courses;

    public StudentDashboardResponse() {
    }

    public String getRegisterNumber() {
        return registerNumber;
    }

    public void setRegisterNumber(String registerNumber) {
        this.registerNumber = registerNumber;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public BigDecimal getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(BigDecimal attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }

    public BigDecimal getGpa() {
        return gpa;
    }

    public void setGpa(BigDecimal gpa) {
        this.gpa = gpa;
    }

    public Integer getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(Integer totalCourses) {
        this.totalCourses = totalCourses;
    }

    public Integer getCompletedCourses() {
        return completedCourses;
    }

    public void setCompletedCourses(Integer completedCourses) {
        this.completedCourses = completedCourses;
    }

    public List<CourseSummary> getCourses() {
        return courses;
    }

    public void setCourses(List<CourseSummary> courses) {
        this.courses = courses;
    }

    public static class CourseSummary {

        private String courseCode;
        private String courseName;
        private Integer credits;

        public CourseSummary() {
        }

        public String getCourseCode() {
            return courseCode;
        }

        public void setCourseCode(String courseCode) {
            this.courseCode = courseCode;
        }

        public String getCourseName() {
            return courseName;
        }

        public void setCourseName(String courseName) {
            this.courseName = courseName;
        }

        public Integer getCredits() {
            return credits;
        }

        public void setCredits(Integer credits) {
            this.credits = credits;
        }
    }
}