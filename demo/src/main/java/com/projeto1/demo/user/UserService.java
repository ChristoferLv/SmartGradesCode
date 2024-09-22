package com.projeto1.demo.user;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projeto1.demo.messages.MessageResponseDTO;
import com.projeto1.demo.roles.ERole;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper = UserMapper.INSTANCE;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public MessageResponseDTO addNewUser(UserDTO userDTO, int creatorId) {
        System.out.println("[User Service] addNewUser " + userDTO.getName());
        System.out.println("[User Service] id of creator " + creatorId);

        //Checa se o usuário que está criando o novo usuário é professor ou admin
        User creatorUser = userRepository.findById((long) creatorId).orElse(null);
        if (creatorUser == null || creatorUser.getRoles().stream().noneMatch(role -> role.getName().equals(ERole.TEACHER) || role.getName().equals(ERole.ADMIN))) {
            return MessageResponseDTO.builder()
                    .message("User with ID " + creatorId + " is not authorized to create new users")
                    .build();
        }

        User userToSave = userMapper.toEntity(userDTO);

        User savedUser = userRepository.save(userToSave);
        return MessageResponseDTO.builder()
                .message("Created user with ID " + savedUser.getId() + " " + savedUser.toString())
                .build();
    }

    public List<String> listAll() {
        System.out.println("[User Service] listAll");
        return userRepository.findAll().stream()
                .map(user -> user.getId() + ": " + user.getName() + "  " + user.getEmail())
                .collect(Collectors.toList());
    }
}
