package com.projeto1.demo.studentsClass;

public enum ClassStateUtil {
    OPEN(1), 
    CLOSED(0);

    private final int code;

    ClassStateUtil(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public static ClassStateUtil fromString(String state) {
        return switch (state.toUpperCase()) {
            case "OPEN" -> OPEN;
            case "CLOSED" -> CLOSED;
            default -> throw new IllegalArgumentException("Invalid state: " + state);
        };
    }

    public static ClassStateUtil fromCode(int code) {
        return switch (code) {
            case 1 -> OPEN;
            case 0 -> CLOSED;
            default -> throw new IllegalArgumentException("Invalid code: " + code);
        };
    }
}