package com.projeto1.demo.certificate;

import java.util.Date;

public record CertificateDTO(
    Long id,
    String createdAt,
    byte[] certificateImage
) {
}
