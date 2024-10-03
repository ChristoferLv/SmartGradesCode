package com.projeto1.demo.user;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
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
import com.projeto1.demo.misc.CertificateGenerator;
import com.projeto1.demo.misc.PasswordUtil;
import com.projeto1.demo.roles.ERole;
import com.projeto1.demo.roles.RoleRepository;
import com.projeto1.demo.roles.Roles;
import com.projeto1.demo.roles.RolesDTO;

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

    @Autowired
    private RoleRepository roleRepository;

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

        Set<Roles> roles = new HashSet<>();

        // Iterate through role names in the DTO and fetch them from the database
        for (RolesDTO roleDTO : userDTO.getRoles()) {
            // Fetch the role from the database
            Optional<Roles> role = roleRepository.findByName(ERole.valueOf(roleDTO.getName()));
            if (role.isPresent()) {
                roles.add(role.get());
            }
        }

        // Create a new user based on the provided DTO and encode the password
        User userToSave = userMapper.toEntity(userDTO);
        userToSave.setRoles(roles);
        userToSave.setPassword(securityConfiguration.passwordEncoder().encode(userDTO.getPassword()));
        userToSave.setState(UserStateUtil.ACTIVE.getState());

        // Save the new user in the repository
        User savedUser = userRepository.save(userToSave);

        return MessageResponseDTO.builder()
                .message("Created user with ID " + savedUser.getId() + " " + savedUser.toString())
                .build();
    }

    public MessageResponseDTO addNewTeacher(UserDTO userDTO, int creatorId) {
        System.out.println("[User Service] addNewTeacher " + userDTO);
        System.out.println("[User Service] id of creator " + creatorId + "\n");

        // Check if the creator user is authorized (Admin)
        User creatorUser = userRepository.findById((long) creatorId).orElse(null);
        if (creatorUser == null || creatorUser.getRoles().stream()
                .noneMatch(role -> role.getName().equals(ERole.ADMIN))) {
            return MessageResponseDTO.builder()
                    .message("User with ID " + creatorId + " is not authorized to create new teachers")
                    .build();
        }

        Set<Roles> roles = new HashSet<>();

        // Iterate through role names in the DTO and fetch them from the database
        for (RolesDTO roleDTO : userDTO.getRoles()) {
            // Fetch the role from the database
            Optional<Roles> role = roleRepository.findByName(ERole.valueOf(roleDTO.getName()));
            if (role.isPresent()) {
                roles.add(role.get());
            }
        }

        // Create a new teacher user based on the provided DTO and encode the password
        User teacherToSave = userMapper.toEntity(userDTO);
        teacherToSave.setRoles(roles);
        teacherToSave.setPassword(securityConfiguration.passwordEncoder().encode(userDTO.getPassword()));
        teacherToSave.setState(UserStateUtil.ACTIVE.getState());
        // teacherToSave.getRoles().add(ERole.TEACHER);

        // Save the new teacher in the repository
        User savedTeacher = userRepository.save(teacherToSave);

        return MessageResponseDTO.builder()
                .message("Created teacher with ID " + savedTeacher.getId() + " " + savedTeacher.toString())
                .build();
    }

    public List<UserDTO> listAllStudents() {
        System.out.println("[User Service] listAllStudents\n");
        return userRepository.findAll().stream()
                .filter(user -> user.getRoles().stream().anyMatch(role -> role.getName().equals(ERole.STUDENT)))
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> listAllTeachers() {
        System.out.println("[User Service] listAllTeachers\n");
        return userRepository.findAll().stream()
                .filter(user -> user.getRoles().stream().anyMatch(role -> role.getName().equals(ERole.TEACHER)))
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
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

    public List<UserDTO> listAll() {
        System.out.println("[User Service] listAll\n");
        return userRepository.findAll().stream()
                .map(user -> userMapper.toDTO(user)) // Map User entity to UserDTO
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
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new UsernameNotFoundException("Student not found"));

        // Generate the new 8-digit password
        String newPassword = PasswordUtil.generateRandomPassword(8);

        // Encode the new password and update the user entity
        student.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(student);

        // Return the new password
        return newPassword;
    }

    public MessageResponseDTO changeUserState(Long userId, ChangeUserStateDTO changeUserStateDTO) {
        System.out.println("[User Service] changeUserState " + userId + "\n");
        // Find the user by ID
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return MessageResponseDTO.builder().message("User with ID " + userId + " not found").build();
        }
        // Update the state of the user
        user.setState(UserStateUtil.fromString(changeUserStateDTO.state()).getState());
        userRepository.save(user);
        return MessageResponseDTO.builder()
                .message("State changed successfully for user ID " + userId)
                .build();
    }

    public MessageResponseDTO changeUserRole(Long userId, List<RolesDTO> rolesDTO) {
        System.out.println("[User Service] changeUserRole " + userId + "\n");
        // Find the user by ID
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return MessageResponseDTO.builder().message("User with ID " + userId + " not found").build();
        }
        // Update the roles of the user
        Set<Roles> roles = new HashSet<>();
        for (RolesDTO roleDTO : rolesDTO.stream().collect(Collectors.toList())) {
            Optional<Roles> role = roleRepository.findByName(ERole.valueOf(roleDTO.getName()));
            if (role.isPresent()) {
                roles.add(role.get());
            }
        }
        user.setRoles(roles);
        userRepository.save(user);
        return MessageResponseDTO.builder()
                .message("Roles changed successfully for user ID " + userId)
                .build();
    }

    public MessageResponseDTO generateCertificate(Long userId) {
        System.out.println("[User Service] generateCertificate " + userId + "\n");
        // Find the user by ID
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return MessageResponseDTO.builder().message("User with ID " + userId + " not found").build();
        }
        // Generate the certificate for the user
        CertificateGenerator.generateCertificate(user);
        return MessageResponseDTO.builder()
                .message("Certificate generated successfully for user ID " + userId)
                .build();
    }
}
