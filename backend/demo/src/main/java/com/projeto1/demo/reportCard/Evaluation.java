package com.projeto1.demo.reportCard;

import org.hibernate.annotations.ManyToAny;
import org.springframework.data.annotation.ReadOnlyProperty;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
import lombok.ToString;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Evaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "report_card_id", nullable = false) // This will create the foreign key column in Evaluation
    @JsonIgnore
    @ToString.Exclude
    private ReportCard reportCard;

    @Column(nullable = false)
    private Integer OT;

    @Column(nullable = false)
    private Integer WT;

    @Column(nullable = false)
    private int evaluationType;

    private Integer finalGrade;

    // Getters and Setters
}

