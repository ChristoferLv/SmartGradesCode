package com.projeto1.demo.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projeto1.demo.messages.MessageResponseDTO;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper = UserMapper.INSTANCE;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public MessageResponseDTO addNewUser(UserDTO userDTO) {
        System.out.println("[User Service] addNewUser " + userDTO.getName());
        User userToSave = userMapper.toEntity(userDTO);

        User savedUser = userRepository.save(userToSave);
        return MessageResponseDTO.builder()
                .message("Created user with ID " + savedUser.getId() + " " + savedUser.toString())
                .build();
    }
}
