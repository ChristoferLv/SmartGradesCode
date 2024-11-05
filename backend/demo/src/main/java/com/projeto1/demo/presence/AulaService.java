package com.projeto1.demo.presence;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projeto1.demo.studentsClass.StudentsClass;
import com.projeto1.demo.studentsClass.StudentsClassRepository;
import com.projeto1.demo.user.User;
import com.projeto1.demo.user.UserRepository;

import java.util.Optional;
import java.util.List;

@Service
public class AulaService {

    @Autowired
    private AulaRepository aulaRepository;

    @Autowired
    private StudentsClassRepository studentsClassRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private UserRepository userRepository;

    // Método para registrar uma nova aula com presenças
    public Aula registerAulaWithAttendance(AulaDTO aulaDTO) {
        Optional<StudentsClass> studentsClassOpt = studentsClassRepository.findById(aulaDTO.getStudentsClassId());

        if (studentsClassOpt.isEmpty()) {
            throw new RuntimeException("Turma não encontrada.");
        }

        StudentsClass studentsClass = studentsClassOpt.get();

        Aula newAula = new Aula();
        newAula.setDate(aulaDTO.getDate());
        newAula.setDescription(aulaDTO.getDescription());
        newAula.setStudentsClass(studentsClass);

        // Processa a lista de presenças enviada no DTO
        List<AttendanceDTO> attendanceDTOs = aulaDTO.getAttendances();
        for (AttendanceDTO attendanceDTO : attendanceDTOs) {
            Optional<User> studentOpt = userRepository.findById(attendanceDTO.getStudentId());

            if (studentOpt.isEmpty()) {
                throw new RuntimeException("Aluno com ID " + attendanceDTO.getStudentId() + " não encontrado.");
            }

            User student = studentOpt.get();

            Attendance attendance = new Attendance();
            attendance.setAula(newAula);
            attendance.setUser(student);
            attendance.setStatus(attendanceDTO.isPresent());

            // Adiciona a presença na aula
            newAula.getAttendances().add(attendance);
        }

        return aulaRepository.save(newAula);
    }

      // Método para buscar todas as aulas
      public List<Aula> getAllAulas() {
        return aulaRepository.findAll();
    }
}

