package com.projeto1.demo.misc;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.time.ZonedDateTime;
import java.time.ZoneId;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties.Security;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import com.projeto1.demo.jwdutils.SecurityConfiguration;
import com.projeto1.demo.reportCard.AcademicPeriod;
import com.projeto1.demo.roles.ERole;
import com.projeto1.demo.roles.RoleRepository;
import com.projeto1.demo.roles.Roles;
import com.projeto1.demo.studentsClass.StudentsClass;
import com.projeto1.demo.studentsClass.StudentsClassRepository;
import com.projeto1.demo.user.User;
import com.projeto1.demo.user.UserRepository;

@Configuration
public class RoleDataLoader {

    @Bean
    @Transactional
    public CommandLineRunner loadRoles(RoleRepository roleRepository, UserRepository userRepository,
            StudentsClassRepository stude) {

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

            SecurityConfiguration sec = new SecurityConfiguration();
            // Verificar se o usuário admin já existe
            Optional<User> adminUserOpt = userRepository.findByUsername("admin");
            if (adminUserOpt.isEmpty()) {
                // Criar o usuário admin com role ADMIN se não existir
                User adminUser = new User();
                adminUser.setUsername("admin");
                String password = "1234";

                adminUser.setPassword(sec.passwordEncoder().encode(password)); // Já criptografada

                // Adicionar o role ADMIN ao usuário
                Set<Roles> roles = new HashSet<>();
                roles.add(adminRole);
                adminUser.setRoles(roles);
                adminUser.setDateOfBirth("2000-01-01");
                adminUser.setPhoneNumber("4499999999");
                adminUser.setUsername("admin");
                adminUser.setEmail("admin@email.com");
                adminUser.setName("admin");
                adminUser.setCreatedAt(ZonedDateTime.now(ZoneId.of("America/Recife")).toInstant().toString());

                // Salvar o usuário admin
                userRepository.save(adminUser);
                System.out.println("Usuário admin criado com sucesso!");
            } else {
                System.out.println("Usuário admin já existe!");
            }

            // Verificar se o usuário professor já existe
            Optional<User> teacherUserOpt = userRepository.findByUsername("teacher");
            if (teacherUserOpt.isEmpty()) {
                // Criar o usuário professor com role TEACHER se não existir
                User teacherUser = new User();
                teacherUser.setUsername("teacher");
                String password = "1234";

                teacherUser.setPassword(sec.passwordEncoder().encode(password)); // Já criptografada

                // Adicionar o role TEACHER ao usuário
                Set<Roles> roles = new HashSet<>();
                roles.add(roleRepository.findByName(ERole.TEACHER).get());
                teacherUser.setRoles(roles);
                teacherUser.setDateOfBirth("2000-01-01");
                teacherUser.setPhoneNumber("4499999999");
                teacherUser.setUsername("teacher");
                teacherUser.setEmail("teacher@email.com");
                teacherUser.setName("teacher");
                teacherUser.setCreatedAt(ZonedDateTime.now(ZoneId.of("America/Recife")).toInstant().toString());
                userRepository.save(teacherUser);
                System.out.println("Usuário teacher criado com sucesso!");
            } else {
                System.out.println("Usuário teacher já existe!");
            }

            // Verificar se o usuário aluno já existe
            Optional<User> studentUserOpt = userRepository.findByUsername("student");
            if (studentUserOpt.isEmpty()) {
                // Criar o usuário aluno com role STUDENT se não existir
                User studentUser = new User();
                studentUser.setUsername("student");
                String password = "1234";

                studentUser.setPassword(sec.passwordEncoder().encode(password)); // Já criptografada

                // Adicionar o role STUDENT ao usuário
                Set<Roles> roles = new HashSet<>();
                roles.add(roleRepository.findByName(ERole.STUDENT).get());
                studentUser.setRoles(roles);
                studentUser.setDateOfBirth("2000-01-01");
                studentUser.setPhoneNumber("4499999999");
                studentUser.setUsername("student");
                studentUser.setEmail("student@email.com");
                studentUser.setName("student");
                studentUser.setState(1);
                studentUser.setCreatedAt(ZonedDateTime.now(ZoneId.of("America/Recife")).toInstant().toString());
                userRepository.save(studentUser);
                System.out.println("Usuário student criado com sucesso!");
            } else {
                System.out.println("Usuário student já existe!");
            }

            StudentsClass studentsClass = new StudentsClass();
            studentsClass.setLevel("5A");
            studentsClass.setPeriod(AcademicPeriod.builder().name("2024-2").build());
            studentsClass.setClassGroup("A");
            stude.save(studentsClass);
            System.out.println("Class 1 criada com sucesso!");


        };
    }
}
