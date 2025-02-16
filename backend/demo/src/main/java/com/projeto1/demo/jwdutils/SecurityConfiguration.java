package com.projeto1.demo.jwdutils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

        @Autowired
        private UserAuthenticationFilter userAuthenticationFilter;

        public static final String[] ENDPOINTS_WITH_AUTHENTICATION_NOT_REQUIRED = {
                        "/api/v1/user/login", // Url que usaremos para fazer login
        };

        // Endpoints que requerem autenticação para serem acessados
        public static final String[] ENDPOINTS_WITH_AUTHENTICATION_REQUIRED = {
                        "/api/v1/user/test",
                        "/api/v1/user/user-info", // todos
                        
                        
                        "/api/v1/user/change-password", // user
                       
                        "/api/v1/user/upload-profile-picture", // todos

                       
                        "/api/v1/reportCard/list-report-cards-from/**", // user
                       
                        "/api/v1/certificate/list/**", // user
                       
        };

        // Endpoints que só podem ser acessador por usuários com permissão de cliente
        public static final String[] ENDPOINTS_TEACHER = {
                        "/api/v1/user", // teacher
                        "/api/v1/user/get-user-by-id/**", // teacher
                        "/api/v1/user/update-user/**", // teacher
                        "/api/v1/user/change-password-of/**", // teacher
                        "/api/v1/user/list-active-users", // teacher
                        "/api/v1/user/list-teachers", // teacher
                        "/api/v1/user/change-role", // teacher

                        "/api/v1/classes", // teacher
                        "/api/v1/classes/get-class-by-id/**", // teacher
                        "/api/v1/classes/update-class/**", // teacher
                        "/api/v1/classes/enroll", // teacher
                        "/api/v1/classes/get-enrolled-class/**", // teacher
                        "/api/v1/classes/students-enrolled/**", // teacher

                        "/api/v1/reportCard", // teacher
                        "/api/v1/reportCard/get-report-card/**", // teacher
                        "/api/v1/reportCard/update-report-card/**", // teacher

                        "/api/v1/certificate/generate/**", // teacher
                        "/api/v1/certificate", // teacher

                        "/api/v1/aulas/register", // teacher
                        "/api/v1/aulas/list", // teacher

                        "/api/v1/attendance/stats", // teacher
                        "/api/v1/aulas/list-class-aulas/**"
        };

        // Endpoints que só podem ser acessador por usuários com permissão de
        // administrador
        public static final String[] ENDPOINTS_ADMIN = {
                        "/api/v1/user/change-role/**", // admin
                        "/api/v1/reportCard/change-report-card-status", //admin
        };

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
                return httpSecurity.csrf(csrf -> csrf.disable()) // Disable CSRF protection
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Stateless
                                                                                                         // session
                                                                                                         // policy
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(HttpMethod.OPTIONS).permitAll() // Allow preflight
                                                                                                 // requests
                                                .requestMatchers(ENDPOINTS_WITH_AUTHENTICATION_NOT_REQUIRED).permitAll() // Public
                                                                                                                         // endpoints
                                                .requestMatchers(ENDPOINTS_WITH_AUTHENTICATION_REQUIRED).authenticated() // Secure
                                                .requestMatchers(ENDPOINTS_TEACHER).hasAnyRole("TEACHER", "ADMIN")
                                                .requestMatchers(ENDPOINTS_ADMIN).hasRole("ADMIN")                                                                // endpoints
                                                .anyRequest().denyAll() // TROCAR PARA DENYALL QUANDO FINALIZADO
                                                                          // !!!!!!!!!!!!!!!!!!!!!!!!!!!
                                )
                                // Only add the authentication filter for endpoints that require authentication
                                .addFilterBefore(userAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                                .build();
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
                        throws Exception {
                System.out.println("isso foi chamado");
                return authenticationConfiguration.getAuthenticationManager();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

}