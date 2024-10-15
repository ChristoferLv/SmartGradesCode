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

    public static final String [] ENDPOINTS_WITH_AUTHENTICATION_NOT_REQUIRED = {
            "/api/v1/user/login", // Url que usaremos para fazer login
    };

     // Endpoints que requerem autenticação para serem acessados
     public static final String [] ENDPOINTS_WITH_AUTHENTICATION_REQUIRED = {
        "/api/v1/user/test",
        "/api/v1/user/user-info",
        "/api/v1/user/change-role",
        "/api/v1/user",
        "/api/v1/user/get-user-by-id",
        "/api/v1/user/update-user",
        "/api/v1/user/change-password-of",
        "/api/v1/user/list-active-users",
        "/api/v1/user/list-teachers",
        "/api/v1/user/change-role",
        "/api/v1/user/upload-profile-picture",
        "/api/v1/classes/get-class-by-id",
        "/api/v1/classes/update-class",
        "/api/v1/classes/enroll",
};


@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
    return httpSecurity.csrf(csrf -> csrf.disable()) // Disable CSRF protection
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Stateless session policy
            .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.OPTIONS).permitAll() // Allow preflight requests
                .requestMatchers(ENDPOINTS_WITH_AUTHENTICATION_NOT_REQUIRED).permitAll() // Public endpoints
                .requestMatchers(ENDPOINTS_WITH_AUTHENTICATION_REQUIRED).authenticated() // Secure endpoints
                .anyRequest().permitAll() // TROCAR PARA DENYALL QUANDO FINALIZADO !!!!!!!!!!!!!!!!!!!!!!!!!!!
            )
            // Only add the authentication filter for endpoints that require authentication
            .addFilterBefore(userAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
}


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
       System.out.println("isso foi chamado");
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}