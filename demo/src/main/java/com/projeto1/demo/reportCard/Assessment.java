package com.projeto1.demo.reportCard;

import com.fasterxml.jackson.annotation.JsonBackReference;

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
import lombok.ToString;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "report_card_id", nullable = true)
    @JsonBackReference // Prevents infinite recursion during serialization
    @ToString.Exclude
    private ReportCard reportCard;

    @Column(nullable = false)
    private String skill; // e.g., "Speaking", "Listening", etc.

    @Column(nullable = false)
    private String rating; // e.g., "Excellent", "Very good", etc.

    // Getters and Setters
}