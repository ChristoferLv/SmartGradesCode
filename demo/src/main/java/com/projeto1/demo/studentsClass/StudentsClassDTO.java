package com.projeto1.demo.studentsClass;

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
    @Size(min = 2, max = 30)
    private String period;
    @NotNull
    @Size(min = 2, max = 40)
    private String classGroup;
}
