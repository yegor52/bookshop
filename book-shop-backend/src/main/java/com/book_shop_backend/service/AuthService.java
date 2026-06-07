package com.book_shop_backend.service;

import com.book_shop_backend.dto.AuthResponse;
import com.book_shop_backend.dto.LoginRequest;
import com.book_shop_backend.dto.RegisterRequest;
import com.book_shop_backend.entity.Client;
import com.book_shop_backend.entity.User;
import com.book_shop_backend.enums.UserStatus;
import com.book_shop_backend.repository.ClientRepository;
import com.book_shop_backend.repository.UserRepository;
import com.book_shop_backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                           ClientRepository clientRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {

        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByLogin(request.getLogin())) {
            throw new RuntimeException("Login already exists");
        }

        if (clientRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();

        user.setLogin(request.getLogin());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setStatus(UserStatus.CLIENT);

        User savedUser = userRepository.save(user);

        Client client = new Client();

        client.setUser(savedUser);
        client.setFio(request.getFio());
        client.setPhoneNumber(request.getPhoneNumber());
        client.setEmail(request.getEmail());

        clientRepository.save(client);

        String token = jwtService.generateToken(
                savedUser.getId(),
                savedUser.getStatus().name()
        );

        return new AuthResponse(
                token,
                savedUser.getStatus().name()
        );
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByLogin(request.getLogin())
                .orElseThrow(() ->
                        new RuntimeException("Invalid login or password")
                );

        boolean matches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!matches) {
            throw new RuntimeException("Invalid login or password");
        }

        String token = jwtService.generateToken(
                user.getId(),
                user.getStatus().name()
        );

        return new AuthResponse(
                token,
                user.getStatus().name()
        );
    }
}