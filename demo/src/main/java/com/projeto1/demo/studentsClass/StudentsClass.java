package com.projeto1.demo.studentsClass;

import com.projeto1.demo.reportCard.AcademicPeriod;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
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

    @Column(nullable = false) // Renamed to avoid conflict
    private String classGroup; //Horário, tipo (Sábado as 15:00)
}
