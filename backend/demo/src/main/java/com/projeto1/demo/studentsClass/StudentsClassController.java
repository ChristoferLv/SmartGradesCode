package com.projeto1.demo.studentsClass;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

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
    public ResponseEntity<?> createNewClass(@RequestBody @Valid StudentsClassDTO studentsClassDTO) {
        System.out.println("[Students Class Controller] createNewClass " + studentsClassDTO.getLevel());

        try {
            MessageResponseDTO response = studentsClassService.addNewClass(studentsClassDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ResponseStatusException e) {
            // Retornar uma resposta mais clara com a mensagem de erro no corpo
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getReason());
            return new ResponseEntity<>(errorResponse, e.getStatusCode());
        } catch (Exception e) {
            System.out.println("[Students Class Controller] Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(MessageResponseDTO.builder()
                    .message("An unexpected error occurred.")
                    .build());
        }
    }

    @PostMapping("/enroll")
    public MessageResponseDTO enrollStudentInClass(@RequestBody EnrollmentRequestDTO enrollmentRequest) {
        studentsClassService.enrollStudentInClass(enrollmentRequest.getStudentId(), enrollmentRequest.getClassId());
        return MessageResponseDTO.builder()
                .message("Student enrolled in class")
                .build();
    }
    
    @PostMapping("/unenroll")
    public MessageResponseDTO unenrollStudentInClass(@RequestBody EnrollmentRequestDTO enrollmentRequest) {
        studentsClassService.unenrollStudentInClass(enrollmentRequest.getStudentId(), enrollmentRequest.getClassId());
        return MessageResponseDTO.builder()
                .message("Student unenrolled in class")
                .build();
    }

    @GetMapping ("/get-enrolled-class/{id}")
    public List<StudentClassDTOSimplified> getClassStudentIsEnroled(@PathVariable Long id) {
        return studentsClassService.getClassStudentIsEnroled(id);
    }

    // Change state of a class
    @PutMapping("/update-state/{id}")
    public MessageResponseDTO changeClassState(@PathVariable Long id,
            @RequestBody ChangeClassStateDTO changeClassStateDTO) {
        System.out.println("[Students Class Controller] changeClassState " + id);
        return studentsClassService.changeClassState(id, changeClassStateDTO);
    }

    @GetMapping("/enroll/{id}")
    public MessageResponseDTO listStudentsInClass(@PathVariable Long id) {
        return studentsClassService.listStudentsInClass(id);
    }
    

    @PutMapping("/update-class/{id}")
    public MessageResponseDTO editClass(@PathVariable Long id, @RequestBody @Valid StudentsClassDTO studentsClassDTO) {
        System.out.println("[Students Class Controller] editClass " + id);
        return studentsClassService.editClass(id, studentsClassDTO);
    }

    @GetMapping
    public List<StudentsClassDTO> listAll() {
        System.out.println("[Students Class Controller] listAll");
        return studentsClassService.listAll();
    }

    @GetMapping("/get-class-by-id/{id}")
    public StudentsClassDTO findById(@PathVariable Long id) {
        System.out.println("[Students Class Controller] findById " + id);
        return studentsClassService.findClassById(id);
    }
}
