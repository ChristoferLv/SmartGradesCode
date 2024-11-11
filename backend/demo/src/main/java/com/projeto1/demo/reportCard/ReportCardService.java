package com.projeto1.demo.reportCard;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.projeto1.demo.messages.MessageResponseDTO;
import com.projeto1.demo.presence.Attendance;
import com.projeto1.demo.presence.AttendanceRepository;
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

    @Autowired
    private AttendanceRepository attendanceRepository;

    public ResponseEntity<MessageResponseDTO> addNewReportCard(ReportCardDTO reportCardDTO) {
        System.out.println("[ReportCard Service] addNewReportCard " + reportCardDTO.getStudentId() + "\n");
        ReportCard reportCard = reportCardMapper.toModel(reportCardDTO);
        User teacher = userRepository.findById(reportCardDTO.getTeacherId()).orElse(null);
        reportCard.setTeacherName(teacher.getName());

        // Verificar se já existe uma avaliação inicial ou final para esta classe
        List<ReportCard> existingReportCards = reportCardRepository
                .findByStudentIdAndStudentClassId(reportCardDTO.getStudentId(), reportCardDTO.getStudentClassId());

        boolean hasFirstEvaluation = existingReportCards.stream()
                .anyMatch(rc -> rc.getEvaluationType() == EvaluationType.FIRST_EVALUATION.getEval());
        boolean hasFinalEvaluation = existingReportCards.stream()
                .anyMatch(rc -> rc.getEvaluationType() == EvaluationType.FINAL_EVALUATION.getEval());

        if (reportCardDTO.getEvaluationType() == EvaluationType.FIRST_EVALUATION.getEval()) {
            if (hasFirstEvaluation) {
                return ResponseEntity.badRequest()
                        .body(MessageResponseDTO.builder()
                                .message("Student already has a first evaluation for this class.").build());
            }
        }

        if (reportCardDTO.getEvaluationType() == EvaluationType.FINAL_EVALUATION.getEval()) {
            if (hasFinalEvaluation) {
                return ResponseEntity.badRequest()
                        .body(MessageResponseDTO.builder()
                                .message("Student already has a final evaluation for this class.").build());
            }
            if (!hasFirstEvaluation) {
                return ResponseEntity.badRequest()
                        .body(MessageResponseDTO.builder()
                                .message("Student must have a first evaluation before a final evaluation.").build());
            }
        }

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
            // Find the first evaluation report card and add the first evaluation to this
            // report card
            Optional<ReportCard> firstEvalReportCard = existingReportCards.stream()
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

        reportCard.setReportCardStatus(true);

        // Save the ReportCard (which will automatically save evaluations and
        // assessments due to CascadeType.ALL)
        reportCardRepository.save(reportCard);

        return ResponseEntity.ok(MessageResponseDTO.builder()
                .message("ReportCard created with ID " + reportCard.getId())
                .build());
    }

    public List<ReportCardDTO> listReportCardByUserId(Long studentId) {
        System.out.println("[ReportCard Service] listReportCardByUserId " + studentId);

        // Fetch the report cards by studentId
        List<ReportCard> reportCards = reportCardRepository.findByStudentId(studentId);

        // Return an empty list if no report cards are found
        if (reportCards == null || reportCards.isEmpty()) {
            return new ArrayList<>();
        }

        return reportCards.stream()
                .map(reportCard -> {
                    // Fetch the user and student class
                    User user = reportCard.getStudent();
                    StudentsClass studentClass = reportCard.getStudentClass();

                    // Handle potential null values for user or studentClass
                    if (user == null || studentClass == null) {
                        return null; // Skip this report card if either is null
                    }

                    // Map to simplified DTOs
                    UserDTOSimplified userDTOSimplified = UserDTOSimplified.builder()
                            .name(user.getName())
                            .id(studentId)
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

                    // Fetch attendance data
                    int aulas = attendanceRepository.countTotalAulas(studentClass.getId());
                    int presentAulas = attendanceRepository.countTotalPresentAttendances(studentId,
                            studentClass.getId());

                    // Set attendance data
                    reportCardDTO.setTotalClasses(aulas);
                    reportCardDTO.setTotalPresentClasses(presentAulas);

                    return reportCardDTO;
                })
                // Filter out null elements (in case any were skipped due to null values)
                .filter(Objects::nonNull)
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
                    .message("Report card not found with ID " + reportCardId)
                    .build();
        }

        // Update basic fields of the report card
        existingReportCard.setEvaluationType(reportCardDTO.getEvaluationType());
        existingReportCard.setComments(reportCardDTO.getComments());

        // Handle evaluations (OT, WT, and final grade)
        List<Evaluation> existingEvaluations = existingReportCard.getEvaluation();
        List<EvaluationDTO> newEvaluationDTOs = reportCardDTO.getEvaluation();

        Map<Long, Evaluation> existingEvaluationMap = existingEvaluations.stream()
                .collect(Collectors.toMap(Evaluation::getId, eval -> eval));

        for (EvaluationDTO newEvalDTO : newEvaluationDTOs) {
            if (newEvalDTO.getId() != null && existingEvaluationMap.containsKey(newEvalDTO.getId())) {
                // Update existing evaluation
                Evaluation existingEvaluation = existingEvaluationMap.get(newEvalDTO.getId());
                existingEvaluation.setOT(newEvalDTO.getOT());
                existingEvaluation.setWT(newEvalDTO.getWT());
                existingEvaluation.setFinalGrade(Math.round((newEvalDTO.getOT() + newEvalDTO.getWT()) / 2));
                existingEvaluation.setEvaluationType(newEvalDTO.getEvaluationType());
            } else {
                // Add new evaluation if it doesn't exist
                Evaluation newEvaluation = Evaluation.builder()
                        .OT(newEvalDTO.getOT())
                        .WT(newEvalDTO.getWT())
                        .finalGrade(Math.round((newEvalDTO.getOT() + newEvalDTO.getWT()) / 2))
                        .evaluationType(newEvalDTO.getEvaluationType())
                        .reportCards(Arrays.asList(existingReportCard)) // Add the current report card
                        .build();
                existingEvaluations.add(newEvaluation);
            }
        }

        // If it's a final evaluation, recalculate the final average considering past
        // evaluations
        if (reportCardDTO.getEvaluationType() == EvaluationType.FINAL_EVALUATION.getEval()) {
            // Recalculate the final average
            double finalAverage = existingEvaluations.stream()
                    .mapToInt(Evaluation::getFinalGrade)
                    .average()
                    .orElse(0);
            existingReportCard.setFinalAverage(Math.round((int) finalAverage));
        }

        // Handle assessments (similar logic to evaluations)
        List<Assessment> existingAssessments = existingReportCard.getAssessments();
        List<AssessmentDTO> newAssessments = reportCardDTO.getAssessments();

        Map<Long, Assessment> existingAssessmentMap = existingAssessments.stream()
                .collect(Collectors.toMap(Assessment::getId, assessment -> assessment));

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
        existingAssessments.removeIf(existingAssessment -> newAssessments.stream()
                .noneMatch(newAssessmentDTO -> newAssessmentDTO.getId() != null
                        && newAssessmentDTO.getId().equals(existingAssessment.getId())));

        // Save the updated report card, evaluations, and assessments
        reportCardRepository.save(existingReportCard);

        return MessageResponseDTO.builder()
                .message("ReportCard updated with ID " + existingReportCard.getId())
                .build();
    }

    public MessageResponseDTO changeReportCardStatus(ReportCardStatusDTO reportCardStatusDTO) {
        System.out.println("[ReportCard Service] changeReportCardStatus " + reportCardStatusDTO.id());

        // Fetch the existing report card from the database
        ReportCard existingReportCard = reportCardRepository.findById(reportCardStatusDTO.id())
                .orElse(null);
        if (existingReportCard == null) {
            return MessageResponseDTO.builder()
                    .message("Report card not found with ID " + reportCardStatusDTO.id())
                    .build();
        }

        // Close the report card
        existingReportCard.setReportCardStatus(reportCardStatusDTO.reportCardStatus());
        reportCardRepository.save(existingReportCard);

        return MessageResponseDTO.builder()
                .message("ReportCard closed with ID " + existingReportCard.getId())
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