package com.projeto1.demo.user;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PasswordChangeDTO {
    @NotNull
    @Size(min = 6, max = 50)
    private String oldPassword;
    @NotNull
    @Size(min = 6, max = 50)
    private String newPassword;

}