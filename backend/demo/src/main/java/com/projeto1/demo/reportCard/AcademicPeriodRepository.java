package com.projeto1.demo.reportCard;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AcademicPeriodRepository extends JpaRepository<AcademicPeriod, Long> {
    Optional<AcademicPeriod> findByName(String name);
}
