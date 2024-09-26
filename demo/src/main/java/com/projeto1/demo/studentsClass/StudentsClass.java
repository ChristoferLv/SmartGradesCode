package com.projeto1.demo.studentsClass;

import java.util.Set;
import java.util.HashSet;

import com.projeto1.demo.reportCard.AcademicPeriod;
import com.projeto1.demo.user.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentsClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String level;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "period_id", nullable = false)
    private AcademicPeriod period;

    @Column(nullable = false)
    private String classGroup;

    @ManyToMany(mappedBy = "studentsClasses")
    @EqualsAndHashCode.Exclude // Prevent infinite loop
    private Set<User> students = new HashSet<>();

    // Getters and Setters
}