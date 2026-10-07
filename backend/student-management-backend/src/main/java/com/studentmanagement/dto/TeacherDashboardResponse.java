package com.studentmanagement.dto;

import java.util.List;

public class TeacherDashboardResponse {

    private Integer teacherId;
    private String teacherCode;
    private String teacherName;

    private Integer totalSubjects;
    private Integer totalStudents;
    private Integer totalEnrollments;

    private List<SubjectSummary> subjects;

    public TeacherDashboardResponse() {
    }

    public Integer getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Integer teacherId) {
        this.teacherId = teacherId;
    }

    public String getTeacherCode() {
        return teacherCode;
    }

    public void setTeacherCode(String teacherCode) {
        this.teacherCode = teacherCode;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public Integer getTotalSubjects() {
        return totalSubjects;
    }

    public void setTotalSubjects(Integer totalSubjects) {
        this.totalSubjects = totalSubjects;
    }

    public Integer getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(Integer totalStudents) {
        this.totalStudents = totalStudents;
    }

    public Integer getTotalEnrollments() {
        return totalEnrollments;
    }

    public void setTotalEnrollments(Integer totalEnrollments) {
        this.totalEnrollments = totalEnrollments;
    }

    public List<SubjectSummary> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<SubjectSummary> subjects) {
        this.subjects = subjects;
    }


    // ==========================================
    // SUBJECT SUMMARY
    // ==========================================

    public static class SubjectSummary {

        private Integer courseId;
        private String courseCode;
        private String courseName;
        private Integer credits;

        private Integer studentCount;

        public SubjectSummary() {
        }

        public Integer getCourseId() {
            return courseId;
        }

        public void setCourseId(Integer courseId) {
            this.courseId = courseId;
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

        public Integer getStudentCount() {
            return studentCount;
        }

        public void setStudentCount(Integer studentCount) {
            this.studentCount = studentCount;
        }
    }
}