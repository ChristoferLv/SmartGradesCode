package com.projeto1.demo.reportCard;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EvaluationsRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByReportCardId(Long reportCardId);

}
