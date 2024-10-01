package com.projeto1.demo.user;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.projeto1.demo.jwdutils.JwtTokenService;
import com.projeto1.demo.jwdutils.LoginUserDTO;
import com.projeto1.demo.jwdutils.RecoveryJwtTokenDto;
import com.projeto1.demo.jwdutils.SecurityConfiguration;
import com.projeto1.demo.messages.MessageResponseDTO;
import com.projeto1.demo.misc.PasswordUtil;
import com.projeto1.demo.roles.ERole;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    private final UserMapper userMapper = UserMapper.INSTANCE;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenService jwtTokenService;

    @Autowired
    private SecurityConfiguration securityConfiguration;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Método responsável por autenticar um usuário e retornar um token JWT
    public RecoveryJwtTokenDto authenticateUser(LoginUserDTO loginUserDto) {
        System.out.println("[User Service] authenticateUser " + loginUserDto.email());
        // Cria um objeto de autenticação com o email e a senha do usuário
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                loginUserDto.email(), loginUserDto.password());
        // System.out.println("[User Service] usernamePasswordAuthenticationToken " +
        // usernamePasswordAuthenticationToken + "\n");
        // System.out.println("[User Service] authenticationManager " +
        // usernamePasswordAuthenticationToken.getAuthorities() + "\n");
        // Autentica o usuário com as credenciais fornecidas
        // System.out.println("[User Service] authenticationBefore");
        // System.out.println("Username: " +
        // usernamePasswordAuthenticationToken.getPrincipal());
        // System.out.println("Password: " +
        // usernamePasswordAuthenticationToken.getCredentials());

        Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);
        // System.out.println("[User Service] authentication "+"\n");
        // Obtém o objeto UserDetails do usuário autenticado
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        // System.out.println("[User Service] userDetails " + userDetails + "\n");
        // Gera um token JWT para o usuário autenticado
        return new RecoveryJwtTokenDto(jwtTokenService.generateToken(userDetails));
    }

    public MessageResponseDTO addNewUser(UserDTO userDTO, int creatorId) {
        System.out.println("[User Service] addNewUser " + userDTO);
        System.out.println("[User Service] id of creator " + creatorId + "\n");

        // Check if the creator user is authorized (Teacher or Admin)
        User creatorUser = userRepository.findById((long) creatorId).orElse(null);
        if (creatorUser == null || creatorUser.getRoles().stream()
                .noneMatch(role -> role.getName().equals(ERole.TEACHER) || role.getName().equals(ERole.ADMIN))) {
            return MessageResponseDTO.builder()
                    .message("User with ID " + creatorId + " is not authorized to create new users")
                    .build();
        }

        // Create a new user based on the provided DTO and encode the password
        User userToSave = userMapper.toEntity(userDTO);
        userToSave.setPassword(securityConfiguration.passwordEncoder().encode(userDTO.getPassword()));

        // Save the new user in the repository
        User savedUser = userRepository.save(userToSave);

        return MessageResponseDTO.builder()
                .message("Created user with ID " + savedUser.getId() + " " + savedUser.toString())
                .build();
    }

    public MessageResponseDTO findByUsername(String username) {
        System.out.println("[User Service] findByUsername " + username);
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return MessageResponseDTO.builder().message("User with username " + username + " not found").build();
        }
        return MessageResponseDTO.builder().message("Found user with username " + username + " " + user.toString())
                .build();
    }

    public List<String> listAll() {
        System.out.println("[User Service] listAll\n");
        return userRepository.findAll().stream()
                .map(user -> user.toString())
                .collect(Collectors.toList());
    }

    public MessageResponseDTO changeUserPassword(Long userId, PasswordChangeDTO passwordChangeDTO) {
        System.out.println("[User Service] changeUserPassword " + userId);
        // Find the user by ID
        User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Check if the old password matches the current password
        if (!passwordEncoder.matches(passwordChangeDTO.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }

        // Check if the new password matches the confirmation password
        if (!passwordChangeDTO.getNewPassword().equals(passwordChangeDTO.getConfirmNewPassword())) {
            throw new IllegalArgumentException("New passwords do not match");
        }

        // Encrypt and update the new password
        user.setPassword(passwordEncoder.encode(passwordChangeDTO.getNewPassword()));
        userRepository.save(user);

        return MessageResponseDTO.builder()
                .message("Password changed successfully for user ID " + userId)
                .build();
    }

    public String changePasswordOfStudent(Long studentId) {
        System.out.println("[User Service] changePasswordOfStudent " + studentId);
        // Find the student by ID
        User student = userRepository.findById(studentId).orElseThrow(() -> new UsernameNotFoundException("Student not found"));

        // Generate the new 8-digit password
        String newPassword = PasswordUtil.generateRandomPassword(8);

        // Encode the new password and update the user entity
        student.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(student);

        // Return the new password
        return newPassword;
    }
}
