package com.projeto1.demo.user;

import java.util.Set;

import com.projeto1.demo.roles.RolesDTO;

import jakarta.persistence.Lob;
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
public class UserDTO {

    private Long id;
    @NotNull
    @Size(min = 2, max = 200)
    private String name;
    @NotNull
    @Size(min = 2, max = 11)
    private String dateOfBirth;
    private String createdAt;
    @NotNull
    @Size(min = 2, max = 11)
    private String phoneNumber;
    @NotNull
    @Size(min = 2, max = 100)
    private String email;
    @NotNull
    @Size(min = 2, max = 100)
    private String password;
    @NotNull
    @Size(min = 2, max = 50)
    private String username;
    @Size(max = 200)
    private String imageUrl;
    @NotNull
    private Set<RolesDTO> roles;
    private int creator; 
    private int state;
    private byte[] profilePicture;
}
