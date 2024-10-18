package com.projeto1.demo.reportCard;

import java.util.ArrayList;
import java.util.List;

import com.projeto1.demo.studentsClass.StudentsClass;
import com.projeto1.demo.user.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student; // Reference to student

    @Column(nullable = false)
    private int evaluationType; // FIRST_EVALUATION or FINAL_EVALUATION

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "reportCard", orphanRemoval = true)
    private List<Assessment> assessments = new ArrayList<>(); // Assessments tied to the report card

    @ManyToOne
    @JoinColumn(name = "students_class_id", nullable = false)
    private StudentsClass studentClass; // Reference to student class

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "reportCard", orphanRemoval = true)
    private List<Evaluation> evaluation = new ArrayList<>(); // One-to-many relation with Evaluation

    @Column
    private Integer finalAverage;

    @Column(nullable = false)
    private String comments;

    @Column(nullable = false)
    private String teacherName;

    // Getters and Setters
}
