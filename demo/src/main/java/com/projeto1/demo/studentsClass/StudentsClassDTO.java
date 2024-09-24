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
@NoArgsConstructor
@AllArgsConstructor
public class StudentsClassDTO {

    private Long id;
    @NotNull
    @Size(min = 2, max = 40)
    private String level;
    @NotNull
    private AcademicPeriod period;
    @NotNull
    @Size(min = 2, max = 40)
    private String classGroup;
}
