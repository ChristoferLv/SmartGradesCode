package com.projeto1.demo.presence;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.projeto1.demo.studentsClass.StudentsClass;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Aula {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    
    private String description;

    @ManyToOne
    @JoinColumn(name = "students_class_id")
    @JsonIgnore
    private StudentsClass studentsClass;

    @OneToMany(mappedBy = "aula", cascade = CascadeType.ALL)
    private List<Attendance> attendances = new ArrayList<>();

    // Getters e Setters
}
