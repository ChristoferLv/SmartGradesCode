package com.projeto1.demo.user;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projeto1.demo.messages.MessageResponseDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public MessageResponseDTO createNewUser(@RequestBody @Valid UserDTO userDTO) {
        System.out.println("[User Controller] registerNewUser " + userDTO.getName());
        int creatorId = userDTO.getCreator();
        return userService.addNewUser(userDTO, creatorId);
    }

    @GetMapping
    public List<String> listAllUsers() {
        System.out.println("[User Controller] listAllUsers");
        return userService.listAll();
    }
}
