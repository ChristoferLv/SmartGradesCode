package com.projeto1.demo.studentsClass;

import com.projeto1.demo.reportCard.AcademicPeriod;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentClassDTOSimplified {
    private Long id;
    private String level;
    private AcademicPeriod period;
    private String classGroup;
}
