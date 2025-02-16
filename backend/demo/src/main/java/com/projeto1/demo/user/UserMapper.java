package com.projeto1.demo.user;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.projeto1.demo.roles.Roles;
import com.projeto1.demo.roles.RolesDTO;

@Mapper
public interface UserMapper {
UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

User toEntity(UserDTO userDTO);

@Mapping(target = "creator", ignore = true)
UserDTO toDTO(User user);

RolesDTO map(Roles value);
}
