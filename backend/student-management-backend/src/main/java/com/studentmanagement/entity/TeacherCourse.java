package com.studentmanagement.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "teacher_courses",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_teacher_course",
            columnNames = {"teacher_id", "course_id"}
        )
    }
)
public class TeacherCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignment_id")
    private Integer assignmentId;

    @ManyToOne
    @JoinColumn(
        name = "teacher_id",
        nullable = false
    )
    private Teacher teacher;

    @ManyToOne
    @JoinColumn(
        name = "course_id",
        nullable = false
    )
    private Course course;

    public TeacherCourse() {
    }

    public Integer getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(Integer assignmentId) {
        this.assignmentId = assignmentId;
    }

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }
}