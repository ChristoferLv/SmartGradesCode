package com.projeto1.demo.studentsClass;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface StudentsClassMapper {
    StudentsClassMapper INSTANCE = Mappers.getMapper(StudentsClassMapper.class);

    StudentsClass toModel(StudentsClassDTO studentsClassDTO);

    StudentsClassDTO toDTO(StudentsClass studentsClass);
}
