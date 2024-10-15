package com.projeto1.demo.reportCard;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ReportCardMapper {

    ReportCardMapper INSTANCE = Mappers.getMapper(ReportCardMapper.class);

    // Map ReportCardDTO to ReportCard (entity)
    @Mapping(source = "studentId", target = "student.id")
    @Mapping(source = "studentClassId", target = "studentClass.id") // Correct mapping for StudentsClass
    ReportCard toModel(ReportCardDTO reportCardDTO);

    // Map ReportCard (entity) to ReportCardDTO
    @Mapping(source = "student.id", target = "studentId")// Mapping student name
    @Mapping(source = "studentClass.id", target = "studentClassId") // Correct mapping for StudentsClass
    ReportCardDTO toDTO(ReportCard reportCard);

    // Mapping between Assessment and AssessmentDTO // Add mapping for reportCardId
    AssessmentDTO toDTO(Assessment assessment);

    @Mapping(target = "reportCard", ignore = true)
    @Mapping(target = "id", ignore = true) // Ignore setting ReportCard from the DTO
    Assessment toModel(AssessmentDTO assessmentDTO);
}
