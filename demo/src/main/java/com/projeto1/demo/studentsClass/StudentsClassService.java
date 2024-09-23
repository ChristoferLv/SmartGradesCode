package com.projeto1.demo.studentsClass;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.projeto1.demo.messages.MessageResponseDTO;

@Service
public class StudentsClassService {

    private final StudentsClassRepository studentsClassRepository;
    private final StudentsClassMapper studentsClassMapper = StudentsClassMapper.INSTANCE;

    public StudentsClassService(StudentsClassRepository studentsClassRepository) {
        this.studentsClassRepository = studentsClassRepository;
    }

    public MessageResponseDTO addNewClass(StudentsClassDTO studentsClassDTO) {
        System.out.println("[Students Class Service] addNewClass " + studentsClassDTO.getLevel());
        StudentsClass studentsClassToSave = studentsClassMapper.toModel(studentsClassDTO);
        studentsClassRepository.save(studentsClassToSave);
        return MessageResponseDTO.builder()
                .message("Created class with ID " + studentsClassToSave.getId() + " " + studentsClassToSave.toString())
                .build();
    }

    public List<String> listAll() {
        System.out.println("[Students Class Service] listAll");
        return studentsClassRepository.findAll().stream()
                .map(studentsClass -> studentsClass.getId() + ": " + studentsClass.getLevel())
                .collect(Collectors.toList());
    }
}
