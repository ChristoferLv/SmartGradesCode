package com.projeto1.demo.reportCard;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ReportCardMapper {

    ReportCardMapper INSTANCE = Mappers.getMapper(ReportCardMapper.class);

    // Map ReportCardDTO to ReportCard (entity)
    @Mapping(source = "studentId", target = "student.id")
    @Mapping(source = "periodId", target = "period.id")
    @Mapping(source = "studentClassId", target = "studentClass.id")
    ReportCard toModel(ReportCardDTO reportCardDTO);

    // Map ReportCard (entity) to ReportCardDTO
    @Mapping(source = "student.id", target = "studentId")
    @Mapping(source = "student.name", target = "studentName") // Mapping student name
    @Mapping(source = "period.id", target = "periodId")
    @Mapping(source = "studentClass.id", target = "studentClassId")
    ReportCardDTO toDTO(ReportCard reportCard);

    // Mapping between Assessment and AssessmentDTO
    AssessmentDTO toDTO(Assessment assessment);
    Assessment toModel(AssessmentDTO assessmentDTO);
}
