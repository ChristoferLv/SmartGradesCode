package com.projeto1.demo.certificate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projeto1.demo.messages.MessageResponseDTO;

@RestController
@RequestMapping("/api/v1/certificate")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @PostMapping("/generate/{userId}")
    public MessageResponseDTO generateCertificate(@PathVariable Long userId) {
        System.out.println("[Certificate Controller] generateCertificate " + userId);
        return certificateService.generateCertificate(userId);
    }

    @GetMapping("/list/{userId}")
    public ResponseEntity getAllUserCertificates(@PathVariable Long userId) {
       System.out.println("[Certificate Controller] getAllUserCertificates " + userId);
         return ResponseEntity.ok(certificateService.getAllUserCertificates(userId));
    }

    @GetMapping
    public ResponseEntity getAllCertificates() {
        System.out.println("[Certificate Controller] getAllCertificates");
        return ResponseEntity.ok(certificateService.getAllCertificates());
    }
}
