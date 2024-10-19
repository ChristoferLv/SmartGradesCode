package com.projeto1.demo.reportCard;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projeto1.demo.messages.MessageResponseDTO;
import com.projeto1.demo.studentsClass.StudentClassDTOSimplified;
import com.projeto1.demo.studentsClass.StudentsClass;
import com.projeto1.demo.studentsClass.StudentsClassMapper;
import com.projeto1.demo.studentsClass.StudentsClassRepository;
import com.projeto1.demo.user.User;
import com.projeto1.demo.user.UserDTOSimplified;
import com.projeto1.demo.user.UserMapper;
import com.projeto1.demo.user.UserRepository;

@Service
public class ReportCardService {

    ReportCardMapper reportCardMapper = ReportCardMapper.INSTANCE;
    UserMapper userMapper = UserMapper.INSTANCE;
    StudentsClassMapper studentClassMapper = StudentsClassMapper.INSTANCE;

    @Autowired
    private ReportCardRepository reportCardRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EvaluationsRepository evaluationsRepository;

    public MessageResponseDTO addNewReportCard(ReportCardDTO reportCardDTO) {
        System.out.println("[ReportCard Service] addNewReportCard " + reportCardDTO.getStudentId());
        ReportCard reportCard = reportCardMapper.toModel(reportCardDTO);
        User teacher = userRepository.findById(reportCardDTO.getTeacherId()).orElse(null);
        reportCard.setTeacherName(teacher.getName());
    
        // Filtrar avaliações com base no tipo de avaliação do boletim
        EvaluationDTO evalDTO = reportCardDTO.getEvaluation().get(0);
        List<Evaluation> evaluations = new ArrayList<>();
    
        if (reportCardDTO.getEvaluationType() == EvaluationType.FIRST_EVALUATION.getEval()) {
            // Create the first evaluation and associate it with the report card
            Evaluation eval = Evaluation.builder()
                    .OT(evalDTO.getOT())
                    .WT(evalDTO.getWT())
                    .finalGrade(Math.round((evalDTO.getOT() + evalDTO.getWT()) / 2))
                    .build();
            evaluations.add(eval);
        }
    
        if (reportCardDTO.getEvaluationType() == EvaluationType.FINAL_EVALUATION.getEval()) {
            // Find the first evaluation report card and add the first evaluation to this report card
            Optional<ReportCard> firstEvalReportCard = reportCardRepository
                    .findByStudentIdAndStudentClassId(reportCardDTO.getStudentId(), reportCardDTO.getStudentClassId())
                    .stream()
                    .filter(rc -> rc.getEvaluationType() == EvaluationType.FIRST_EVALUATION.getEval())
                    .findFirst();
    
            if (firstEvalReportCard.isPresent()) {
                // Reuse the first evaluation for the final report card
                evaluations.add(firstEvalReportCard.get().getEvaluation().get(0));
    
                // Create the second (final) evaluation for the final report card
                Evaluation secondEvaluation = reportCardMapper.toModel(evalDTO);
                secondEvaluation.setFinalGrade(Math.round((evalDTO.getOT() + evalDTO.getWT()) / 2));
                evaluations.add(secondEvaluation);
    
                // Calculate final average from both evaluations
                double finalAverage = evaluations.stream()
                        .mapToInt(Evaluation::getFinalGrade)
                        .average()
                        .orElse(0);
                reportCard.setFinalAverage(Math.round((int) finalAverage));
            }
        }
    
        reportCard.setEvaluation(evaluations);
    
        // Convert and save assessments
        List<Assessment> assessments = reportCardDTO.getAssessments().stream()
                .map(assessmentDTO -> {
                    Assessment assessment = new Assessment();
                    assessment.setSkill(assessmentDTO.getSkill());
                    assessment.setRating(assessmentDTO.getRating());
                    assessment.setReportCard(reportCard);
                    return assessment;
                })
                .collect(Collectors.toList());
    
        reportCard.setAssessments(assessments);
    
        // Save the ReportCard (which will automatically save evaluations and assessments due to CascadeType.ALL)
        reportCardRepository.save(reportCard);
    
        return MessageResponseDTO.builder().message("ReportCard created with ID " + reportCard.getId()).build();
    }
    

    public List<ReportCardDTO> listReportCardByUserId(Long studentId) {
        System.out.println("[ReportCard Service] listReportCardByUserId " + studentId);
        return reportCardRepository.findByStudentId(studentId).stream()
                .map(reportCard -> {
                    // Fetch the user and student class
                    User user = reportCard.getStudent();
                    StudentsClass studentClass = reportCard.getStudentClass();

                    // Map to simplified DTOs
                    UserDTOSimplified userDTOSimplified = UserDTOSimplified.builder().name(user.getName()).id(studentId)
                            .build();
                    StudentClassDTOSimplified studentClassDTOSimplified = StudentClassDTOSimplified.builder()
                            .id(studentClass.getId())
                            .level(studentClass.getLevel())
                            .classGroup(studentClass.getClassGroup())
                            .period(studentClass.getPeriod())
                            .build();

                    // Map the report card to DTO
                    ReportCardDTO reportCardDTO = reportCardMapper.toDTO(reportCard);

                    // Set the student and student class fields
                    reportCardDTO.setStudent(userDTOSimplified);
                    reportCardDTO.setStudentClass(studentClassDTOSimplified);

                    return reportCardDTO;
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

        // // Fetch the existing report card from the database
        // ReportCard existingReportCard = reportCardRepository.findById(reportCardId)
        //         .orElse(null);
        // if (existingReportCard == null) {
        //     return MessageResponseDTO.builder()
        //             .message("First report card not found with ID " + reportCardId)
        //             .build();
        // }

        // // Update the basic fields of the report card
        // existingReportCard.setEvaluationType(reportCardDTO.getEvaluationType());
        // existingReportCard.setComments(reportCardDTO.getComments());

        // // Handle evaluations (OT, WT, and final grade)
        // List<Evaluation> existingEvaluations = existingReportCard.getEvaluation();
        // List<EvaluationDTO> newEvaluationDTOs = reportCardDTO.getEvaluation();

        // // Clear existing evaluations and set new ones
        // existingEvaluations.clear();
        // for (EvaluationDTO newEvalDTO : newEvaluationDTOs) {
        //     Evaluation newEval = Evaluation.builder()
        //             .OT(newEvalDTO.getOT())
        //             .WT(newEvalDTO.getWT())
        //             .finalGrade(Math.round((newEvalDTO.getOT() + newEvalDTO.getWT()) / 2))
        //             .evaluationType(newEvalDTO.getEvaluationType())
        //             .reportCard(existingReportCard)
        //             .build();
        //     existingEvaluations.add(newEval);
        // }

        // // If it's a final evaluation, recalculate the final average considering past
        // // evaluations
        // if (reportCardDTO.getEvaluationType() == EvaluationType.FINAL_EVALUATION.getEval()) {
        //     Optional<Evaluation> firstEvaluation = evaluationsRepository.findById(reportCardDTO.getId());
        //     if (firstEvaluation.isPresent()) {
        //         existingEvaluations.add(firstEvaluation.get());

        //         // Recalculate the final average
        //         double finalAverage = existingEvaluations.stream()
        //                 .mapToInt(Evaluation::getFinalGrade)
        //                 .average()
        //                 .orElse(0);
        //         existingReportCard.setFinalAverage(Math.round((int) finalAverage));
        //     }
        // }

        // // Update the assessments
        // List<Assessment> existingAssessments = existingReportCard.getAssessments();
        // List<AssessmentDTO> newAssessments = reportCardDTO.getAssessments();

        // // Create a map of existing assessments for quick lookup by ID
        // Map<Long, Assessment> existingAssessmentMap = existingAssessments.stream()
        //         .collect(Collectors.toMap(Assessment::getId, assessment -> assessment));

        // // Update existing assessments or add new ones
        // for (AssessmentDTO newAssessmentDTO : newAssessments) {
        //     if (newAssessmentDTO.getId() != null && existingAssessmentMap.containsKey(newAssessmentDTO.getId())) {
        //         // Update existing assessment
        //         Assessment existingAssessment = existingAssessmentMap.get(newAssessmentDTO.getId());
        //         existingAssessment.setSkill(newAssessmentDTO.getSkill());
        //         existingAssessment.setRating(newAssessmentDTO.getRating());
        //     } else {
        //         // Add new assessment
        //         Assessment newAssessment = new Assessment();
        //         newAssessment.setSkill(newAssessmentDTO.getSkill());
        //         newAssessment.setRating(newAssessmentDTO.getRating());
        //         newAssessment.setReportCard(existingReportCard);
        //         existingAssessments.add(newAssessment);
        //     }
        // }

        // // Remove assessments that are no longer present in the updated report card
        // existingAssessments.removeIf(existingAssessment -> newAssessments.stream()
        //         .noneMatch(newAssessmentDTO -> newAssessmentDTO.getId() != null
        //                 && newAssessmentDTO.getId().equals(existingAssessment.getId())));

        // // Save the updated report card and its evaluations and assessments
        // reportCardRepository.save(existingReportCard);

        return MessageResponseDTO.builder()
                .message("ReportCard updated with ID " + "existingReportCard.getId()")
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