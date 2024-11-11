package com.projeto1.demo.presence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projeto1.demo.studentsClass.StudentsClass;

public interface AulaRepository extends JpaRepository<Aula, Long>{
 // Count the total number of aulas in a specific class
    int countByStudentsClass(StudentsClass studentsClass);
    List<Aula> findByStudentsClassIdOrderByDateDesc(Long id);
}
