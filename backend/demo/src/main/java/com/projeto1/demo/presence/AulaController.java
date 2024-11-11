package com.projeto1.demo.presence;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/aulas")
public class AulaController {

    @Autowired
    private AulaService aulaService;

    // Endpoint para registrar uma nova aula com presenças
    @PostMapping("/register")
    public ResponseEntity<Aula> registerAula(@RequestBody AulaDTO aulaDTO) {
        try {
            Aula aula = aulaService.registerAulaWithAttendance(aulaDTO);
            return new ResponseEntity<>(aula, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/list-class-aulas/{id}")
    public ResponseEntity<List<Aula>> getAulasByClassId(@PathVariable Long id) {
        List<Aula> aulas = aulaService.getAulasByClassId(id);
        if (aulas.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(aulas, HttpStatus.OK);
    }

    @GetMapping("/list")
    public ResponseEntity<List<Aula>> getAllAulas() {
        List<Aula> aulas = aulaService.getAllAulas();
        if (aulas.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(aulas, HttpStatus.OK);
    }
}
