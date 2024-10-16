package com.projeto1.demo.reportCard;

import java.util.List;
import java.util.Map;
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
        System.out.println("[ReportCard Service] addNewReportCard " + reportCardDTO.getStudentId());
        ReportCard reportCard = reportCardMapper.toModel(reportCardDTO);

        reportCard.setFinalGrade(Math.round((reportCardDTO.getOT() + reportCardDTO.getWT()) / 2));

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

        // 3. Save the ReportCard (this will automatically save the assessments due to
        // CascadeType.ALL)
        reportCardRepository.save(reportCard);
        return MessageResponseDTO.builder().message("ReportCard created with ID " + reportCard.getId()).build();
    }

    public List<ReportCardDTO> listReportCardByUserId(Long studentId) {
        System.out.println("[ReportCard Service] listReportCardByUserId " + studentId);
        return reportCardRepository.findByStudentId(studentId).stream()
                .map(reportCard -> {
                    return reportCardMapper.toDTO(reportCard);
                })
                .collect(Collectors.toList());
    }

    public ReportCardDTO getReportCardById(Long reportCardId) {
        System.out.println("[ReportCard Service] getReportCardById " + reportCardId);
        return reportCardRepository.findById(reportCardId)
                .map(reportCard -> {
                    return reportCardMapper.toDTO(reportCard);
                })
                .orElse(null);
    }

    public MessageResponseDTO updateReportCard(Long reportCardId, ReportCardDTO reportCardDTO) {
        System.out.println("[ReportCard Service] updateReportCard " + reportCardId);
    
        // Fetch the existing report card from the database
        ReportCard existingReportCard = reportCardRepository.findById(reportCardId)
            .orElse(null);
        if (existingReportCard == null) {
            return MessageResponseDTO.builder()
                .message("ReportCard not found with ID " + reportCardId)
                .build();
        }
    
        // Map the new report card data from DTO, excluding assessments
       
        existingReportCard.setEvaluationType(reportCardDTO.getEvaluationType());
        existingReportCard.setOT(reportCardDTO.getOT());
        existingReportCard.setWT(reportCardDTO.getWT());
        existingReportCard.setFinalGrade(Math.round((reportCardDTO.getOT() + reportCardDTO.getWT()) / 2));
    
        // Update the assessments
        List<Assessment> existingAssessments = existingReportCard.getAssessments();
        List<AssessmentDTO> newAssessments = reportCardDTO.getAssessments();
    
        // Create a map of existing assessments for quick lookup by ID
        Map<Long, Assessment> existingAssessmentMap = existingAssessments.stream()
            .collect(Collectors.toMap(Assessment::getId, assessment -> assessment));
    
        // Update existing assessments or add new ones
        for (AssessmentDTO newAssessmentDTO : newAssessments) {
            if (newAssessmentDTO.getId() != null && existingAssessmentMap.containsKey(newAssessmentDTO.getId())) {
                // Update existing assessment
                Assessment existingAssessment = existingAssessmentMap.get(newAssessmentDTO.getId());
                existingAssessment.setSkill(newAssessmentDTO.getSkill());
                existingAssessment.setRating(newAssessmentDTO.getRating());
            } else {
                // Add new assessment
                Assessment newAssessment = new Assessment();
                newAssessment.setSkill(newAssessmentDTO.getSkill());
                newAssessment.setRating(newAssessmentDTO.getRating());
                newAssessment.setReportCard(existingReportCard);
                existingAssessments.add(newAssessment);
            }
        }
    
        // Remove assessments that are no longer present in the updated report card
        existingAssessments.removeIf(existingAssessment -> 
            newAssessments.stream().noneMatch(newAssessmentDTO -> 
                newAssessmentDTO.getId() != null && newAssessmentDTO.getId().equals(existingAssessment.getId())
            )
        );
    
        // Save the updated report card and assessments
        reportCardRepository.save(existingReportCard);
    
        return MessageResponseDTO.builder()
            .message("ReportCard updated with ID " + existingReportCard.getId())
            .build();
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