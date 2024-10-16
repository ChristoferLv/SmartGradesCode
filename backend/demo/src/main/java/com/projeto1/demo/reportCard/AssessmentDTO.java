package com.projeto1.demo.reportCard;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AssessmentDTO {
    private Long id;
    private String skill; // "Speaking", "Listening, Reading, Writing/Grammar, Effort, Attendance, Content Retention, Homework"
    private String rating; // "Excellent", "Very Good, Good, Satisfactory, Poor"
}