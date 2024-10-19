package com.projeto1.demo.reportCard;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportCardRepository extends JpaRepository<ReportCard, Long> {

    List<ReportCard> findByStudentId(Long studentId);

    // Fetch report cards by both student ID and student class ID
    List<ReportCard> findByStudentIdAndStudentClassId(Long studentId, Long studentClassId);
}
