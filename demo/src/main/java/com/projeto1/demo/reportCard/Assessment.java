package com.projeto1.demo.reportCard;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Builder;
import lombok.Data;

@Entity
@Data
@Builder
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "report_card_id", nullable = false)
    private ReportCard reportCard;

    @Column(nullable = false)
    private String skill; // e.g., "Speaking", "Listening", etc.

    @Column(nullable = false)
    private String rating; // e.g., "Excellent", "Very good", etc.

    // Getters and Setters
}
