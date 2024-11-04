package com.projeto1.demo.presence;
import java.time.LocalDate;
import java.util.List;

public class AulaDTO {

    private LocalDate date;
    private String description;
    private Long studentsClassId;
    private List<AttendanceDTO> attendances;  // Lista de presenças

    // Getters e Setters
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getStudentsClassId() {
        return studentsClassId;
    }

    public void setStudentsClassId(Long studentsClassId) {
        this.studentsClassId = studentsClassId;
    }

    public List<AttendanceDTO> getAttendances() {
        return attendances;
    }

    public void setAttendances(List<AttendanceDTO> attendances) {
        this.attendances = attendances;
    }
}
