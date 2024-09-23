package com.projeto1.demo.misc;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import com.projeto1.demo.roles.ERole;
import com.projeto1.demo.roles.RoleRepository;
import com.projeto1.demo.roles.Roles;
import com.projeto1.demo.user.User;
import com.projeto1.demo.user.UserRepository;

@Configuration
public class RoleDataLoader {

    @Bean
    @Transactional
    public CommandLineRunner loadRoles(RoleRepository roleRepository, UserRepository userRepository) {

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

            // Verificar e criar a Role ADMIN
            Optional<Roles> adminRoleOpt = roleRepository.findByName(ERole.ADMIN);
            Roles adminRole;
            if (adminRoleOpt.isEmpty()) {
                adminRole = new Roles(ERole.ADMIN);
                roleRepository.save(adminRole);
                System.out.println("Role ADMIN created");
            } else {
                adminRole = adminRoleOpt.get();
            }


            
            // Verificar se o usuário admin já existe
            Optional<User> adminUserOpt = userRepository.findByUsername("admin");
            if (adminUserOpt.isEmpty()) {
                // Criar o usuário admin com role ADMIN se não existir
                User adminUser = new User();
                adminUser.setUsername("admin");
                adminUser.setPassword("admin123"); // Sem criptografia, apenas texto simples

                // Adicionar o role ADMIN ao usuário
                Set<Roles> roles = new HashSet<>();
                roles.add(adminRole);
                adminUser.setRoles(roles);
                adminUser.setDateOfbirth("2000-01-01");
                adminUser.setPhoneNumber("4499999999");
                adminUser.setUsername("admin");
                adminUser.setEmail("admin@email.com");
                adminUser.setName("admin");

                // Salvar o usuário admin
                userRepository.save(adminUser);
                System.out.println("Usuário admin criado com sucesso!");
            } else {
                System.out.println("Usuário admin já existe!");
            }

        };
    }
}
