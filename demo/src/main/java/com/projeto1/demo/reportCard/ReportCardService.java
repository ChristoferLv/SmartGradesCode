package com.projeto1.demo.reportCard;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projeto1.demo.messages.MessageResponseDTO;

import jakarta.transaction.Transactional;

@Service
public class ReportCardService {

    private final ReportCardRepository reportCardRepository;
    private final AssessmentRepository assessmentRepository; // Add this repository to save assessments

    @Autowired
    public ReportCardService(ReportCardRepository reportCardRepository, AssessmentRepository assessmentRepository) {
        this.reportCardRepository = reportCardRepository;
        this.assessmentRepository = assessmentRepository; // Initialize the assessment repository
    }

    @Transactional
    public MessageResponseDTO addNewReportCard(ReportCardDTO reportCardDTO) {
        System.out.println("[ReportCard Service] addNewReportCard " + reportCardDTO.getStudentName() + "\n");

        // Step 1: Map Assessments from DTO to Entity
        List<Assessment> assessments = reportCardDTO.getAssessments().stream()
                .map(assessmentDTO -> {
                    Assessment assessment = ReportCardMapper.INSTANCE.toModel(assessmentDTO);
                    // Initially set the report card to null
                    assessment.setReportCard(null);
                    return assessment;
                })
                .collect(Collectors.toList());

        // Step 2: Save Assessments
        List<Assessment> savedAssessments = assessmentRepository.saveAll(assessments);

        // Step 3: Create ReportCard entity
        ReportCard reportCard = ReportCardMapper.INSTANCE.toModel(reportCardDTO);
        reportCard.setAssessments(savedAssessments); // Set the saved assessments to the report card

        // Step 4: Save the ReportCard
        reportCard = reportCardRepository.save(reportCard); // Save the report card first

        // Step 5: Update each assessment with the report card reference
        for (Assessment assessment : savedAssessments) {
            assessment.setReportCard(reportCard); // Set the report card reference in assessments
            assessmentRepository.save(assessment); // Save updated assessment with report card reference
        }

        return MessageResponseDTO.builder().message("Report Card created with ID " + reportCard.getId()).build();
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