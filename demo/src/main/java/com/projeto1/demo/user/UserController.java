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

    @GetMapping()
    public List<String> listAllUsers() {
        System.out.println("[User Controller] listAllUsers");
        return userService.listAll();
    }
}
