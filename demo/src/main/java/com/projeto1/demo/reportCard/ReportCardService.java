package com.projeto1.demo.reportCard;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projeto1.demo.messages.MessageResponseDTO;


@Service
public class ReportCardService {


    ReportCardMapper reportCardMapper = ReportCardMapper.INSTANCE;

    @Autowired
    private ReportCardRepository reportCardRepository;


    public MessageResponseDTO addNewReportCard(ReportCardDTO reportCardDTO) {
       ReportCard reportCard = reportCardMapper.toModel(reportCardDTO);


        // 2. Convert and save assessments
        List<Assessment> assessments = reportCardDTO.getAssessments().stream()
            .map(assessmentDTO -> {
                Assessment assessment = new Assessment();
                assessment.setSkill(assessmentDTO.getSkill());
                assessment.setRating(assessmentDTO.getRating());
                assessment.setReportCard(reportCard); // Set the ReportCard reference
                return assessment;
            })
            .collect(Collectors.toList());

        reportCard.setAssessments(assessments); // Set assessments in the ReportCard

        // 3. Save the ReportCard (this will automatically save the assessments due to CascadeType.ALL)
        reportCardRepository.save(reportCard);
        return MessageResponseDTO.builder().message("ReportCard created with ID " + reportCard.getId()).build();
    }

    public List<ReportCard> listReportCardByUserId(Long studentId) {
        System.out.println("[ReportCard Service] listReportCardByUserId " + studentId);
        return reportCardRepository.findByStudentId(studentId);
    }

    public List<String> listAll() {
        System.out.println("[ReportCard Service] listAll\n");
        return reportCardRepository.findAll().stream()
                .map(reportCard -> {
                    return reportCard.toString();
                })
                .collect(Collectors.toList());
    }
}