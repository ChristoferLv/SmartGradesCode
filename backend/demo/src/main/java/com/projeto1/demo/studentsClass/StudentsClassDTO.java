package com.projeto1.demo.studentsClass;

import java.util.HashSet;
import java.util.Set;

import com.projeto1.demo.reportCard.AcademicPeriod;
import com.projeto1.demo.user.User;
import com.projeto1.demo.user.UserDTO;
import com.projeto1.demo.user.UserDTOSimplified;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
    private Set<UserDTOSimplified> students = new HashSet<>();
    @Min(0)
    @Max(5)
    private int state;
}
