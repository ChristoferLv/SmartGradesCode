package com.projeto1.demo.user;

import java.util.List;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.projeto1.demo.jwdutils.LoginUserDTO;
import com.projeto1.demo.jwdutils.RecoveryJwtTokenDto;
import com.projeto1.demo.messages.MessageResponseDTO;
import com.projeto1.demo.roles.RolesDTO;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginUserDTO loginUserDto) {
        try {
            System.out.println("[User Controller] authenticateUser " + loginUserDto.email());
            RecoveryJwtTokenDto token = userService.authenticateUser(loginUserDto);
            return new ResponseEntity<>(token, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            // Retornar uma resposta mais clara com a mensagem de erro no corpo
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getReason());
            return new ResponseEntity<>(errorResponse, e.getStatusCode());
        }
    }

    @GetMapping("/user-info")
    public UserDTO getUserInfo(HttpServletRequest request) {
        System.out.println("[User Controller] getUserInfo");
        // System.out.println("Request Headers do controller: " +
        // Collections.list(request.getHeaderNames()));
        // System.out.println("Request: " + request);

        // Get the Authorization header from the request
        String authorizationHeader = request.getHeader("Authorization");
        // System.out.println("Authorization Header: " + authorizationHeader);

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("JWT Token is missing or malformed");
        }

        // Extract the token by removing the "Bearer " prefix
        String token = authorizationHeader.substring(7);

        // Pass the token to the service to get user info
        return userService.getUserInfo(token);
    }

    @GetMapping("/test")
    public ResponseEntity<String> getAuthenticationTest() {
        System.out.println("[User Controller] getAuthenticationTest");
        return new ResponseEntity<>("Autenticado com sucesso", HttpStatus.OK);
    }

    @PostMapping
    public MessageResponseDTO createNewUser(@RequestBody @Valid UserDTO userDTO, HttpServletRequest request) {
        System.out.println("[User Controller] registerNewUser " + userDTO.getName());

        String authorizationHeader = request.getHeader("Authorization");
        // System.out.println("Authorization Header: " + authorizationHeader);

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("JWT Token is missing or malformed");
        }

        // Extract the token by removing the "Bearer " prefix
        String token = authorizationHeader.substring(7);

        return userService.addNewUser(userDTO, token);
    }

    @PostMapping("/new-teacher")
    public MessageResponseDTO createNewTeacher(@RequestBody @Valid UserDTO userDTO) {
        System.out.println("[User Controller] registerNewTeacher " + userDTO.getName());
        int creatorId = userDTO.getCreator();
        return userService.addNewTeacher(userDTO, creatorId);
    }

    @GetMapping("/list-teachers")
    public List<UserDTO> listAllTeachers() {
        System.out.println("[User Controller] listAllTeachers");
        return userService.listAllTeachers();
    }

    @GetMapping("/list-students")
    public List<UserDTO> listAllStudents() {
        System.out.println("[User Controller] listAllStudents");
        return userService.listAllStudents();
    }

    @GetMapping("/get-user-by-id/{id}")
    public UserDTO getUserById(@PathVariable Long id) {
        System.out.println("[User Controller] getUserById " + id);
        return userService.getUserById(id);
    }

    @Valid
    @PutMapping("/change-password")
    public ResponseEntity<MessageResponseDTO> changePassword(HttpServletRequest request,
            @RequestBody PasswordChangeDTO passwordChangeDTO) {
        System.out.println("[User Controller] changePassword");

        String authorizationHeader = request.getHeader("Authorization");
        // System.out.println("Authorization Header: " + authorizationHeader);

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("JWT Token is missing or malformed");
        }

        // Extract the token by removing the "Bearer " prefix
        String token = authorizationHeader.substring(7);

        MessageResponseDTO response = userService.changeUserPassword(passwordChangeDTO, token);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/change-password-of/{studentId}")
    public ResponseEntity<String> changePasswordOfStudent(@PathVariable Long studentId) {
        System.out.println("[User Controller] changePasswordOfStudent " + studentId);
        String newPassword = userService.changePasswordOfStudent(studentId);
        return ResponseEntity.ok("New password for student ID " + studentId + ": " + newPassword);
    }

    @PutMapping("/change-state/{id}")
    public MessageResponseDTO changeUserState(@PathVariable Long id, @RequestBody ChangeUserStateDTO userStateDTO) {
        System.out.println("[User Controller] changeUserState " + id);
        return userService.changeUserState(id, userStateDTO);
    }

    @PutMapping("/change-role/{id}")
    public MessageResponseDTO changeUserRole(@PathVariable Long id, @RequestBody List<RolesDTO> rolesDTO) {
        System.out.println("[User Controller] changeUserRole " + id);
        return userService.changeUserRole(id, rolesDTO);
    }

    @PostMapping("/generate-certificate/{id}")
    public MessageResponseDTO generateCertificate(@PathVariable Long id) {
        System.out.println("[User Controller] generateCertificate " + id);
        return userService.generateCertificate(id);
    }

    @GetMapping
    public List<UserDTO> listAllUsers() {
        System.out.println("[User Controller] listAllUsers");
        return userService.listAll();
    }
}
