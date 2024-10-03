package com.projeto1.demo.user;

public enum UserStateUtil {
    INACTIVE(0),
    ACTIVE(1),
    ENRROLED(2),
    FINISHED(3);

    private final int state;

    UserStateUtil(int state) {
        this.state = state;
    }

    public int getState() {
        return state;
    }

    public static UserStateUtil fromString(String state) {
        return switch (state.toUpperCase()) {
            case "INACTIVE" -> INACTIVE;
            case "ACTIVE" -> ACTIVE;
            case "ENRROLED" -> ENRROLED;
            case "FINISHED" -> FINISHED;
            default -> throw new IllegalArgumentException("Invalid state: " + state);
        };
    }

    public static UserStateUtil fromCode(int code) {
        return switch (code) {
            case 0 -> INACTIVE;
            case 1 -> ACTIVE;
            case 2 -> ENRROLED;
            case 3 -> FINISHED;
            default -> throw new IllegalArgumentException("Invalid code: " + code);
        };
    }
}
