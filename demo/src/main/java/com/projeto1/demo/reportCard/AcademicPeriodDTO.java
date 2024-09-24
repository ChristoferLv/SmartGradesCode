package com.projeto1.demo.reportCard;

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
public class AcademicPeriodDTO {

    private Long id;
    @NotNull
    @Size(min = 2, max = 20)
    private String name; // e.g., "2021-2"
}
