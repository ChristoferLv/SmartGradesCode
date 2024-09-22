package com.projeto1.demo.misc;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import com.projeto1.demo.roles.ERole;
import com.projeto1.demo.roles.RoleRepository;
import com.projeto1.demo.roles.Roles;

import java.util.Optional;

import javax.management.relation.Role;

@Configuration
public class RoleDataLoader {

    @Bean
    @Transactional
    public CommandLineRunner loadRoles(RoleRepository roleRepository) {
        return args -> {
            // Verificar se os papéis já existem e criar se não existirem
            if (roleRepository.findByName(ERole.STUDENT).isEmpty()) {
                roleRepository.save(new Roles(ERole.STUDENT));
                System.out.println("Role STUDENT created");
            }

            if (roleRepository.findByName(ERole.TEACHER).isEmpty()) {
                roleRepository.save(new Roles(ERole.TEACHER));
                System.out.println("Role TEACHER created");
            }

            if (roleRepository.findByName(ERole.ADMIN).isEmpty()) {
                roleRepository.save(new Roles(ERole.ADMIN));
                System.out.println("Role ADMIN created");
            }
        };
    }
}
