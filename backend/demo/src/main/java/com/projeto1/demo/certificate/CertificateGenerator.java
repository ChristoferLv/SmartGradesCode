package com.projeto1.demo.certificate;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import javax.imageio.ImageIO;

import com.projeto1.demo.studentsClass.StudentsClass;
import com.projeto1.demo.user.User;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;

public class CertificateGenerator {
    public static byte[] generateCertificate(User user, StudentsClass studentsClass) {
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
            String level = studentsClass.getLevel();
            String period = studentsClass.getPeriod().getName();

            // Get the position where you want to add the text (e.g., center the text)
            FontMetrics fm = g2d.getFontMetrics();
            int xName = (certificateTemplate.getWidth() - fm.stringWidth(studentName)) / 2;
            int yName = (certificateTemplate.getHeight() / 2) - 70; // Adjust based on the image

            int xDate = (certificateTemplate.getWidth() - fm.stringWidth(date)) / 2;
            int yDate = yName + 50; // Adjust based on the image

            int xLevel = (certificateTemplate.getWidth() - fm.stringWidth(level)) / 2;
            int yLevel = yDate + 50; // Adjust based on the image

            int xPeriod = (certificateTemplate.getWidth() - fm.stringWidth(period)) / 2;
            int yPeriod = yLevel + 50; // Adjust based on the image

            // Add the text to the certificate
            g2d.drawString(studentName, xName, yName);
            g2d.drawString(date, xDate, yDate);
            g2d.drawString(level, xLevel, yLevel);
            g2d.drawString(period, xPeriod, yPeriod);

            // Clean up
            g2d.dispose();

            // Convert the image to a byte array
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(certificateTemplate, "jpg", baos);
            byte[] imageBytes = baos.toByteArray();
            baos.close();

            // Return the byte array representing the image
            return imageBytes;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
