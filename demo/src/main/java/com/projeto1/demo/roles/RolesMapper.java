package com.projeto1.demo.roles;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface RolesMapper {
    RolesMapper INSTANCE = Mappers.getMapper(RolesMapper.class);

    Roles toEntity(RolesDTO rolesDTO);

    RolesDTO toDTO(Roles roles);
}
