package com.projeto1.demo.studentsClass;

import org.springframework.format.annotation.NumberFormat;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentRequestDTO {

    @NotNull
    @NumberFormat(style = NumberFormat.Style.NUMBER)
    private Long studentId;
    @NotNull
    @NumberFormat(style = NumberFormat.Style.NUMBER)
    private Long classId;

    // Getters and Setters
}
