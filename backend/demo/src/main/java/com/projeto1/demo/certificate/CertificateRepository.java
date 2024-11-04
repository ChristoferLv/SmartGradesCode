package com.projeto1.demo.certificate;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificateRepository extends JpaRepository<StudentCertificate, Long> {
    public List<StudentCertificate> findByUserId(Long userId);
}
