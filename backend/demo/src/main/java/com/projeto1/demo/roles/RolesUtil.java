package com.projeto1.demo.roles;

public enum RolesUtil {

    ROLE_USER(0),
    ROLE_TEACHER(1),
    ROLE_ADMIN(2);

    private final int role;

    RolesUtil(int role) {
        this.role = role;
    }

    public int getRole() {
        return role;
    }

    public static RolesUtil fromString(String role) {
        return switch (role.toUpperCase()) {
            case "ROLE_USER" -> ROLE_USER;
            case "ROLE_TEACHER" -> ROLE_TEACHER;
            case "ROLE_ADMIN" -> ROLE_ADMIN;
            default -> throw new IllegalArgumentException("Invalid role: " + role);
        };
    }

    public static RolesUtil fromCode(int role) {
        return switch (role) {
            case 0 -> ROLE_USER;
            case 1 -> ROLE_TEACHER;
            case 2 -> ROLE_ADMIN;
            default -> throw new IllegalArgumentException("Invalid code: " + role);
        };
    }
}
