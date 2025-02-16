package com.projeto1.demo.user;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.projeto1.demo.certificate.StudentCertificate;
import com.projeto1.demo.presence.Attendance;
import com.projeto1.demo.roles.Roles;
import com.projeto1.demo.studentsClass.StudentsClass;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String dateOfBirth;

    @Column(nullable = false)
    private String createdAt;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String username;

    @Column
    private int state;

    @Column
    private byte[] profilePicture;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<StudentCertificate> certificates;


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Roles> roles = new HashSet<>();

    // Many-to-Many relationship with StudentsClass
    @ManyToMany
    @JoinTable(name = "user_students_class", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "students_class_id"))
    @ToString.Exclude // Prevent circular references
    @EqualsAndHashCode.Exclude // Prevent circular references
    private Set<StudentsClass> studentsClasses = new HashSet<>();

    // Relationship with Attendance
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Attendance> attendances;
    // Getters and Setters
}
