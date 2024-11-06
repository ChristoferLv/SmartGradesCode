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
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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

    @Column(nullable = false)
    private boolean reportCardStatus;   //Boletim aberto, boletim fechado. Quando fechado, apenas o admin pode fazer modificações
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(nullable = false)
    private int evaluationType;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "reportCard", orphanRemoval = true)
    private List<Assessment> assessments = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "students_class_id", nullable = false)
    private StudentsClass studentClass;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
        name = "report_card_evaluation",
        joinColumns = @JoinColumn(name = "report_card_id"),
        inverseJoinColumns = @JoinColumn(name = "evaluation_id")
    )
    private List<Evaluation> evaluation = new ArrayList<>();

    @Column
    private Integer finalAverage;

    @Column(nullable = false)
    private String comments;

    @Column(nullable = false)
    private String teacherName;

    // Getters and Setters
}
