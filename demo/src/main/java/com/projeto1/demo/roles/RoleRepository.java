package com.projeto1.demo.roles;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Roles, Long> {
    @Query("SELECT r FROM Roles r WHERE r.name = :name")
    Optional<Roles> findByName(ERole name);
}
