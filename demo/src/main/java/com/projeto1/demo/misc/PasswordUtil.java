package com.projeto1.demo.misc;

import java.util.Random;

public class PasswordUtil {

    public static String generateRandomPassword(int length) {
        String numbers = "0123456789abcdefghijklmnopqrstuvwxyz";
        StringBuilder password = new StringBuilder(length);

        Random random = new Random();

        for (int i = 0; i < length; i++) {
            password.append(numbers.charAt(random.nextInt(numbers.length())));
        }

        return password.toString();
    }
}
