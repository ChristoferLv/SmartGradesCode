package com.projeto1.demo.studentsClass;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.projeto1.demo.messages.MessageResponseDTO;
import com.projeto1.demo.reportCard.AcademicPeriod;
import com.projeto1.demo.reportCard.AcademicPeriodRepository;
import com.projeto1.demo.user.User;
import com.projeto1.demo.user.UserDTOSimplified;
import com.projeto1.demo.user.UserRepository;

@Service
public class StudentsClassService {

    private final StudentsClassRepository studentsClassRepository;
    private final StudentsClassMapper studentsClassMapper = StudentsClassMapper.INSTANCE;
    private final UserRepository userRepository;
    @Autowired
    private AcademicPeriodRepository academicPeriodRepository;

    @Autowired
    public StudentsClassService(StudentsClassRepository studentsClassRepository, UserRepository userRepository) {
        this.studentsClassRepository = studentsClassRepository;
        this.userRepository = userRepository;
    }

    public MessageResponseDTO addNewClass(StudentsClassDTO studentsClassDTO) {
        System.out.println("[Students Class Service] addNewClass " + studentsClassDTO.getLevel() + "\n");

        // Check if a class with the same level, period, and classGroup already exists
        Optional<StudentsClass> existingClass = studentsClassRepository.findByLevelAndPeriodNameAndClassGroup(
                studentsClassDTO.getLevel(),
                studentsClassDTO.getPeriod().getName(),
                studentsClassDTO.getClassGroup() // Assuming DTO has classGroup field
        );

        if (existingClass.isPresent()) {
            // Return an error message if class exists
            System.out.println(
                    "[Students Class Service] Error: A class with the same level, period, and class group already exists.");
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Error: A class with the same level, period, and class group already exists.");
        }

        try {
            // Map DTO to entity
            StudentsClass studentsClassToSave = studentsClassMapper.toModel(studentsClassDTO);

            // Find existing AcademicPeriod or create a new one
            String periodName = studentsClassDTO.getPeriod().getName(); // Assuming DTO has period name
            Optional<AcademicPeriod> existingPeriod = academicPeriodRepository.findByName(periodName);

            if (existingPeriod.isPresent()) {
                // Use the existing period
                studentsClassToSave.setPeriod(existingPeriod.get());
            } else {
                // Create new period and set it
                AcademicPeriod newPeriod = new AcademicPeriod();
                newPeriod.setName(periodName);
                studentsClassToSave.setPeriod(newPeriod);
            }

            // Set state and save the class
            studentsClassToSave.setState(1);
            studentsClassRepository.save(studentsClassToSave);

            System.out.println("[Students Class Service] Created class with ID " + studentsClassToSave.getId());

            return MessageResponseDTO.builder()
                    .message("Created class with ID " + studentsClassToSave.getId() + " "
                            + studentsClassToSave.toString())
                    .build();

        } catch (Exception e) {
            System.out.println("[Students Class Service] Error: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error occurred while creating the class.");
        }
    }

    public MessageResponseDTO enrollStudentInClass(Long studentId, Long classId) {
        System.out.println("[Students Class Service] enrollStudentInClass " + studentId + " " + classId + "\n");
        User student = userRepository.findById(studentId).orElse(null);
        StudentsClass studentsClass = studentsClassRepository.findById(classId).orElse(null);

        if (student == null || studentsClass == null) {
            return MessageResponseDTO.builder()
                    .message("Student or class not found")
                    .build();
        }

        student.getStudentsClasses().add(studentsClass);
        studentsClass.getStudents().add(student);

        // Change the user state to ENROLLED
        student.setState(2); // Assuming 2 represents the ENROLLED state

        userRepository.save(student); // Persist the changes
        studentsClassRepository.save(studentsClass); // Persist the changes
        return MessageResponseDTO.builder()
                .message("Student " + student.getName() + " enrolled in class " + studentsClass.getLevel())
                .build();
    }

    public MessageResponseDTO unenrollStudentInClass(Long studentId, Long classId) {
        System.out.println("[Students Class Service] unenrollStudentInClass " + studentId + " " + classId + "\n");
        User student = userRepository.findById(studentId).orElse(null);
        StudentsClass studentsClass = studentsClassRepository.findById(classId).orElse(null);
        student.getStudentsClasses().remove(studentsClass);
        studentsClass.getStudents().remove(student);

        student.setState(1);

        userRepository.save(student);
        studentsClassRepository.save(studentsClass);
        return MessageResponseDTO.builder()
                .message("Student " + student.getName() + " unenrolled in class " + studentsClass.getLevel())
                .build();

    }

    public List<StudentClassDTOSimplified> getClassStudentIsEnroled(Long id) {
        System.out.println("[Students Class Service] getClassStudentIsEnroled " + id + "\n");
        User student = userRepository.findById(id).orElse(null);
        if (student == null) {
            return null;
        }

        // Filter the student's classes to return only the active ones
        List<StudentsClass> activeClasses = student.getStudentsClasses().stream()
                .filter(studentClass -> studentClass.getState() == 1) // Assuming state == 1 means 'ACTIVE'
                .collect(Collectors.toList());

        // If no active classes are found, return null or handle accordingly
        if (activeClasses.isEmpty()) {
        // return empty List
            return new ArrayList<StudentClassDTOSimplified>();
        }

        // Convert the active classes to a DTO (adjust this part based on your DTO
        // structure)
        return activeClasses.stream().map(activeClass -> StudentClassDTOSimplified.builder()
                .id(activeClass.getId())
                .level(activeClass.getLevel())
                .period(activeClass.getPeriod())
                .classGroup(activeClass.getClassGroup())
                .build()).collect(Collectors.toList());

    }

    //Return a list of students in a class or a message if the class is not found
    public ResponseEntity<?> listStudentsInClass(Long id) {
        System.out.println("[Students Class Service] listStudentsInClass " + id + "\n");
        StudentsClass studentsClass = studentsClassRepository.findById(id).orElse(null);
        if (studentsClass == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(MessageResponseDTO.builder()
                    .message("Class not found")
                    .build());
        }
        //Return list of students with userDTOSimplified
        return ResponseEntity.ok(studentsClass.getStudents().stream()
                .map(student -> UserDTOSimplified.builder()
                        .id(student.getId())
                        .name(student.getName())
                        .build())
                .collect(Collectors.toList()));
    }

    public MessageResponseDTO changeClassState(Long id, ChangeClassStateDTO changeClassStateDTO) {
        System.out.println("[Students Class Service] changeClassState " + id + "\n");
        StudentsClass studentsClass = studentsClassRepository.findById(id).orElse(null);
        if (studentsClass == null) {
            return MessageResponseDTO.builder()
                    .message("Class not found")
                    .build();
        }
        studentsClass.setState(ClassStateUtil.fromString(changeClassStateDTO.state()).getCode());
        studentsClassRepository.save(studentsClass);
        return MessageResponseDTO.builder()
                .message("Class state changed to " + changeClassStateDTO.state())
                .build();
    }

    public MessageResponseDTO editClass(Long id, StudentsClassDTO studentsClassDTO) {
        System.out.println("[Students Class Service] editClass " + id + "\n");
        StudentsClass studentsClass = studentsClassRepository.findById(id).orElse(null);
        if (studentsClass == null) {
            return MessageResponseDTO.builder()
                    .message("Class not found")
                    .build();
        }
        studentsClass.setClassGroup(studentsClassDTO.getClassGroup());
        studentsClass.setState(studentsClassDTO.getState());
        studentsClassRepository.save(studentsClass);
        return MessageResponseDTO.builder()
                .message("Class edited")
                .build();
    }

    public List<StudentsClassDTO> listAll() {
        System.out.println("[Students Class Service] listAll\n");
        return studentsClassRepository.findAll().stream()
                .map(studentsClass -> studentsClassMapper.toDTO(studentsClass))
                .collect(Collectors.toList());
    }

    public StudentsClassDTO findClassById(Long id) {
        System.out.println("[Students Class Service] findClassById " + id + "\n");
        StudentsClass studentsClass = studentsClassRepository.findById(id).orElse(null);
        if (studentsClass == null) {
            return null;
        }
        return studentsClassMapper.toDTO(studentsClass);
    }
}
