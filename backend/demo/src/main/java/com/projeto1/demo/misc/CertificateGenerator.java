package com.projeto1.demo.misc;

import java.io.File;
import java.io.IOException;
import java.sql.Date;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import javax.imageio.ImageIO;

import com.projeto1.demo.user.User;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;

public class CertificateGenerator {
    public static void generateCertificate(User user) {
        try {
            // Load the certificate template image
            BufferedImage certificateTemplate = ImageIO.read(new File("./src/main/java/com/projeto1/demo/imgs/template.jpg"));

            // Create a Graphics2D object
            Graphics2D g2d = certificateTemplate.createGraphics();

            // Set font properties
            Font font = new Font("Serif", Font.BOLD, 40);
            g2d.setFont(font);
            g2d.setColor(Color.BLACK);

            // Text to be added to the certificate
            String studentName = user.getName();
            String date = ZonedDateTime.now(ZoneId.of("America/Recife")).toLocalDate().toString();

            // Get the position where you want to add the text (e.g., center the text)
            FontMetrics fm = g2d.getFontMetrics();
            int xName = (certificateTemplate.getWidth() - fm.stringWidth(studentName)) / 2;
            int yName = certificateTemplate.getHeight() / 2; // Adjust based on the image

            int xDate = (certificateTemplate.getWidth() - fm.stringWidth(date)) / 2;
            int yDate = yName + 50; // Adjust based on the image

            // Add the text to the certificate
            g2d.drawString(studentName, xName, yName);
            g2d.drawString(date, xDate, yDate);

            // Save the modified image
            File output = new File("./src/main/java/com/projeto1/demo/imgs/certificate.jpg");
            ImageIO.write(certificateTemplate, "jpg", output);

            // Clean up
            g2d.dispose();

            System.out.println("Certificate generated successfully!");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}