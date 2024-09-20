package com.projeto1.demo.roles;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RolesDTO {

    private Long id;
    
    @NotNull
    private String name;

    // Getters and setters
}
