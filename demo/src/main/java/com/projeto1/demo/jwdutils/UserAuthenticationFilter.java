package com.projeto1.demo.jwdutils;

import java.io.IOException;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.projeto1.demo.user.User;
import com.projeto1.demo.user.UserDetailsImpl;
import com.projeto1.demo.user.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class UserAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenService jwtTokenService; // Service que definimos anteriormente

    @Autowired
    private UserRepository userRepository; // Repository que definimos anteriormente

        @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //System.out.println("1 - Verifica se o endpoint requer autenticação antes de processar a requisição");
        if (checkIfEndpointIsNotPublic(request)) {
            //System.out.println("2 - Recupera o token do cabeçalho Authorization da requisição");
            String token = recoveryToken(request); // Recupera o token do cabeçalho Authorization da requisição
            if (token != null) {
                //System.out.println("3 - Obtém o assunto (neste caso, o nome de usuário) do token");
                String subject = jwtTokenService.getSubjectFromToken(token); // Obtém o assunto (neste caso, o nome de usuário) do token
                //System.out.println("4 - Busca o usuário pelo email (que é o assunto do token)");
                User user = userRepository.findByEmail(subject).get(); // Busca o usuário pelo email (que é o assunto do token)
               //System.out.println("5 - Cria um UserDetails com o usuário encontrado");
                UserDetailsImpl userDetails = new UserDetailsImpl(user); // Cria um UserDetails com o usuário encontrado
    
                //System.out.println("6 - Cria um objeto de autenticação do Spring Security");
                Authentication authentication =
                        new UsernamePasswordAuthenticationToken(userDetails.getUsername(), null, userDetails.getAuthorities());
    
                //System.out.println("7 - Define o objeto de autenticação no contexto de segurança do Spring Security");
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                //System.out.println("8 - O token está ausente.");
                throw new RuntimeException("O token está ausente.");
            }
        }
        //System.out.println("9 - Continua o processamento da requisição");
        filterChain.doFilter(request, response); // Continua o processamento da requisição
    }
    
    // Recupera o token do cabeçalho Authorization da requisição
    private String recoveryToken(HttpServletRequest request) {
        //System.out.println("10 - Recupera o token do cabeçalho Authorization da requisição");
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null) {
            //System.out.println("11 - Retorna o token sem o prefixo 'Bearer '");
            return authorizationHeader.replace("Bearer ", "");
        }
        //System.out.println("12 - O cabeçalho Authorization está ausente");
        return null;
    }
    
    // Verifica se o endpoint requer autenticação antes de processar a requisição
    private boolean checkIfEndpointIsNotPublic(HttpServletRequest request) {
        //System.out.println("13 - Verifica se o endpoint requer autenticação antes de processar a requisição");
        String requestURI = request.getRequestURI();
        return !Arrays.asList(SecurityConfiguration.ENDPOINTS_WITH_AUTHENTICATION_NOT_REQUIRED).contains(requestURI);
    }
}