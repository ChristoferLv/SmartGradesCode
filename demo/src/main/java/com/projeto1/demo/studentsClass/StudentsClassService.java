package com.projeto1.demo.studentsClass;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projeto1.demo.messages.MessageResponseDTO;
import com.projeto1.demo.user.User;
import com.projeto1.demo.user.UserRepository;

@Service
public class StudentsClassService {

    private final StudentsClassRepository studentsClassRepository;
    private final StudentsClassMapper studentsClassMapper = StudentsClassMapper.INSTANCE;
    private final UserRepository userRepository;

    @Autowired
    public StudentsClassService(StudentsClassRepository studentsClassRepository, UserRepository userRepository) {
        this.studentsClassRepository = studentsClassRepository;
        this.userRepository = userRepository;
    }

    public MessageResponseDTO addNewClass(StudentsClassDTO studentsClassDTO) {
        System.out.println("[Students Class Service] addNewClass " + studentsClassDTO.getLevel() + "\n");
        StudentsClass studentsClassToSave = studentsClassMapper.toModel(studentsClassDTO);
        studentsClassToSave.setState(1);
        studentsClassRepository.save(studentsClassToSave);
        return MessageResponseDTO.builder()
                .message("Created class with ID " + studentsClassToSave.getId() + " " + studentsClassToSave.toString())
                .build();
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

        userRepository.save(student); // Persist the changes
        // studentsClassRepository.save(studentsClass); // Persist the changes
        return MessageResponseDTO.builder()
                .message("Student " + student.getName() + " enrolled in class " + studentsClass.getLevel())
                .build();
    }

    public MessageResponseDTO listStudentsInClass(Long id) {
        System.out.println("[Students Class Service] listStudentsInClass " + id + "\n");
        StudentsClass studentsClass = studentsClassRepository.findById(id).orElse(null);
        if (studentsClass == null) {
            return MessageResponseDTO.builder()
                    .message("Class not found")
                    .build();
        }
        return MessageResponseDTO.builder()
                .message("Students in class " + studentsClass.getLevel() + ": " + studentsClass.getStudents()).build();
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
    
    public List<String> listAll() {
        System.out.println("[Students Class Service] listAll\n");
        return studentsClassRepository.findAll().stream()
                .map(studentsClass -> studentsClass.getId() + ": " + studentsClass.toString())
                .collect(Collectors.toList());
    }
}
