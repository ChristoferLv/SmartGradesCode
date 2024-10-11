package com.projeto1.demo.studentsClass;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import com.projeto1.demo.user.User;
import com.projeto1.demo.user.UserDTOSimplified;

@Mapper
public interface StudentsClassMapper {
    StudentsClassMapper INSTANCE = Mappers.getMapper(StudentsClassMapper.class);

    StudentsClass toModel(StudentsClassDTO studentsClassDTO);

    @Mapping(target = "students", source = "students", qualifiedByName = "userToSimplifiedDTO")
    StudentsClassDTO toDTO(StudentsClass studentsClass);

    @Named("userToSimplifiedDTO")
    default Set<UserDTOSimplified> userToSimplifiedDTO(Set<User> users) {
        if (users == null) {
            return new HashSet<>();
        }
        return users.stream()
                .map(user -> new UserDTOSimplified(user.getId(), user.getName()))
                .collect(Collectors.toSet());
    }
}
