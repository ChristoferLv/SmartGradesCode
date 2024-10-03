package com.projeto1.demo.roles;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RolesDTO {

    @NotNull
    @Pattern(regexp = "TEACHER|STUDENT|ADMIN")
    private String name;

    // Getters and setters
}
