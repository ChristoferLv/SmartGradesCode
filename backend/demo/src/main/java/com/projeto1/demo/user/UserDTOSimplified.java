package com.projeto1.demo.user;

import com.projeto1.demo.studentsClass.StudentClassDTOSimplified;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTOSimplified {
    private Long id;
    private String name;
}
