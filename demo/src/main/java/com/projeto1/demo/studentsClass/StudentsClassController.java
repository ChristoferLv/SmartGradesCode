package com.projeto1.demo.studentsClass;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projeto1.demo.messages.MessageResponseDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/classes")
public class StudentsClassController {

    StudentsClassService studentsClassService;

    @Autowired
    public StudentsClassController(StudentsClassService studentsClassService) {
        this.studentsClassService = studentsClassService;
    }

    @PostMapping
    public MessageResponseDTO createNewClass(@RequestBody @Valid StudentsClassDTO studentsClassDTO) {
        System.out.println("[Students Class Controller] createNewClass " + studentsClassDTO.getLevel());
        return studentsClassService.addNewClass(studentsClassDTO);
    }

    @PostMapping("/enroll")
    public MessageResponseDTO enrollStudentInClass(@RequestBody EnrollmentRequestDTO enrollmentRequest) {
        studentsClassService.enrollStudentInClass(enrollmentRequest.getStudentId(), enrollmentRequest.getClassId());
        return MessageResponseDTO.builder()
                .message("Student enrolled in class")
                .build();
    }

    //Change state of a class
    @PutMapping("/update-state/{id}")
    public MessageResponseDTO changeClassState(@PathVariable Long id, @RequestBody ChangeClassStateDTO changeClassStateDTO) {
        System.out.println("[Students Class Controller] changeClassState " + id);
        return studentsClassService.changeClassState(id, changeClassStateDTO);
    }  

    @GetMapping("/enroll/{id}")
    public MessageResponseDTO listStudentsInClass(@PathVariable Long id) {
        return studentsClassService.listStudentsInClass(id);
    }

    @PutMapping("/edit/{id}")
    public MessageResponseDTO editClass(@PathVariable Long id, @RequestBody @Valid StudentsClassDTO studentsClassDTO) {
        System.out.println("[Students Class Controller] editClass " + id);
        return studentsClassService.editClass(id, studentsClassDTO);
    }

    @GetMapping
    public List<String> listAll() {
        System.out.println("[Students Class Controller] listAll");
        return studentsClassService.listAll();
    }
}
