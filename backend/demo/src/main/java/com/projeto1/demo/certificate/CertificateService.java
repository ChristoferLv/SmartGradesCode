package com.projeto1.demo.certificate;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.projeto1.demo.messages.MessageResponseDTO;
import com.projeto1.demo.studentsClass.ClassStateUtil;
import com.projeto1.demo.studentsClass.StudentsClass;
import com.projeto1.demo.user.User;
import com.projeto1.demo.user.UserRepository;

@Service
public class CertificateService {

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<MessageResponseDTO> generateCertificate(Long userId) {
        System.out.println("[Certificate Service] generateCertificate " + userId + "\n");

        // Find the user by ID
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest()
                    .body(MessageResponseDTO.builder().message("User not found for ID " + userId).build());
        }

        // Find all classes the student is enrolled in
        List<StudentsClass> studentClasses = new ArrayList<>(user.getStudentsClasses());
        if (studentClasses == null || studentClasses.isEmpty())
            return ResponseEntity.badRequest()
                    .body(MessageResponseDTO.builder().message("No classes found for user ID " + userId).build());

        // Find the active class
        StudentsClass activeClass = studentClasses.stream()
                .filter(studentClass -> studentClass.getState() == ClassStateUtil.OPEN.getCode())
                .findFirst()
                .orElse(null);
        if (activeClass == null) {
            return ResponseEntity.badRequest().body(
                    MessageResponseDTO.builder().message("No active class found for user ID " + userId).build());
        }

        // Check if a certificate already exists for this user in the active class
        boolean certificateExists = certificateRepository.existsByUserIdAndStudentsClassId(userId, activeClass.getId());
        if (certificateExists) {
            return ResponseEntity.badRequest().body(MessageResponseDTO.builder()
                    .message("Certificate already exists for this student.").build());
        }

        // Generate the certificate for the user and the active class
        byte[] certificateImage = CertificateGenerator.generateCertificate(user, activeClass);

        // Save the certificate in the repository
        StudentCertificate certificate = new StudentCertificate();
        certificate.setUser(user);
        certificate.setStudentsClass(activeClass);
        certificate.setCertificateImage(certificateImage);
        certificate.setCreatedAt(ZonedDateTime.now(ZoneId.of("America/Recife")).toInstant().toString());
        certificateRepository.save(certificate);

        return ResponseEntity
                .ok(MessageResponseDTO.builder().message("Certificate generated for user ID " + userId).build());

    }

    public List<CertificateDTO> getAllUserCertificates(Long userId) {
        System.out.println("[Certificate Service] getAllUserCertificates " + userId + "\n");

        // Find the user by ID
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }
        System.out.println("User: " + userId);
        // Find all certificates for the user
        List<StudentCertificate> certificates = certificateRepository.findByUserId(userId);
        if (certificates == null || certificates.isEmpty()) {
            return new ArrayList<>();
        }

        // Convert the certificates to DTOs
        List<CertificateDTO> certificateDTOs = new ArrayList<>();
        for (StudentCertificate certificate : certificates) {
            certificateDTOs.add(new CertificateDTO(
                    certificate.getId(),
                    certificate.getCreatedAt(),
                    certificate.getCertificateImage()));
        }

        return certificateDTOs;
    }

    public List<CertificateDTO> getAllCertificates() {
        System.out.println("[Certificate Service] getAllCertificates" + "\n");

        // Find all certificates
        List<StudentCertificate> certificates = certificateRepository.findAll();
        if (certificates == null || certificates.isEmpty()) {
            return null;
        }

        // Convert the certificates to DTOs
        List<CertificateDTO> certificateDTOs = new ArrayList<>();
        for (StudentCertificate certificate : certificates) {
            certificateDTOs.add(new CertificateDTO(
                    certificate.getId(),
                    certificate.getCreatedAt(),
                    certificate.getCertificateImage()));
        }

        return certificateDTOs;
    }
}
