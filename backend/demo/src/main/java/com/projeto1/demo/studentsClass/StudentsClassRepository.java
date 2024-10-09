package com.projeto1.demo.studentsClass;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentsClassRepository extends JpaRepository<StudentsClass, Long> {
    Optional<StudentsClass> findByLevelAndPeriodNameAndClassGroup(String level, String periodName, String classGroup);
}
