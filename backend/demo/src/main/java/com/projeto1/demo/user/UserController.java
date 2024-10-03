package com.projeto1.demo.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projeto1.demo.jwdutils.LoginUserDTO;
import com.projeto1.demo.jwdutils.RecoveryJwtTokenDto;
import com.projeto1.demo.messages.MessageResponseDTO;
import com.projeto1.demo.roles.RolesDTO;

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
    public ResponseEntity<RecoveryJwtTokenDto> authenticateUser(@RequestBody LoginUserDTO loginUserDto) {
        System.out.println("[User Controller] authenticateUser " + loginUserDto.email());
        RecoveryJwtTokenDto token = userService.authenticateUser(loginUserDto);
        return new ResponseEntity<>(token, HttpStatus.OK);
    }

    @GetMapping("/test")
    public ResponseEntity<String> getAuthenticationTest() {
        return new ResponseEntity<>("Autenticado com sucesso", HttpStatus.OK);
    }

    @PostMapping
    public MessageResponseDTO createNewUser(@RequestBody @Valid UserDTO userDTO) {
        System.out.println("[User Controller] registerNewUser " + userDTO.getName());
        int creatorId = userDTO.getCreator();
        return userService.addNewUser(userDTO, creatorId);
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

    @Valid
    @PutMapping("/change-password/{id}")
    public ResponseEntity<MessageResponseDTO> changePassword(@PathVariable Long id,
            @RequestBody PasswordChangeDTO passwordChangeDTO) {
        System.out.println("[User Controller] changePassword " + id);
        MessageResponseDTO response = userService.changeUserPassword(id, passwordChangeDTO);
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
