package com.projeto1.demo.reportCard;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ReportCardDTO {

    private Long id;

    private Long studentId; // Link with a student

    private Long periodId; // Link with a period

    private EvaluationType evaluationType; // FIRST_EVALUATION or FINAL_EVALUATION

    private List<AssessmentDTO> assessments; // Assessments in the report card

    private Long studentClassId; // Link with the student class

    private Integer OT; // Oral Test grade

    private Integer WT; // Written Test grade

    private Integer finalGrade; // Final grade for the evaluation

    // Getters and Setters (can be generated by Lombok)
}
