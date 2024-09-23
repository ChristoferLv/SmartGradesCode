package com.projeto1.demo.studentsClass;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projeto1.demo.messages.MessageResponseDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/classes")
public class StudentsClassController {

    StudentsClassService studentsClassService;

    public StudentsClassController(StudentsClassService studentsClassService) {
        this.studentsClassService = studentsClassService;
    }

    @PostMapping
    public MessageResponseDTO createNewClass(@RequestBody @Valid StudentsClassDTO studentsClassDTO) {
        System.out.println("[Students Class Controller] createNewClass " + studentsClassDTO.getLevel());
        return studentsClassService.addNewClass(studentsClassDTO);
    }

    @GetMapping
    public List<String> listAll() {
        System.out.println("[Students Class Controller] listAll");
        return studentsClassService.listAll();
    }
}
