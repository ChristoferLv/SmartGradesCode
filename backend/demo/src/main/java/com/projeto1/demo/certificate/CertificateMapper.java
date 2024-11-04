package com.projeto1.demo.certificate;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.projeto1.demo.user.UserMapper;

@Mapper
public interface CertificateMapper {
CertificateMapper INSTANCE = Mappers.getMapper(CertificateMapper.class);

CertificateDTO toDTO(StudentCertificate certificate);
}
