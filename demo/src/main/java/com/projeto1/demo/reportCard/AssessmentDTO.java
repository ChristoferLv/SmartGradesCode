package com.projeto1.demo.reportCard;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AssessmentDTO {

    private String skill; // e.g., "Speaking", "Listening"
    private String rating; // e.g., "Excellent", "Very Good"
}