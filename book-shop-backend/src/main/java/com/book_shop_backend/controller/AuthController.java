package com.book_shop_backend.controller;

import com.book_shop_backend.dto.AuthResponse;
import com.book_shop_backend.dto.LoginRequest;
import com.book_shop_backend.dto.RegisterRequest;
import com.book_shop_backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }

    /**
     * POST /api/auth/logout
     * Stateless JWT: сервер не хранит сессии, токен инвалидируется на клиенте.
     * Эндпоинт нужен для единообразия API и возможного будущего чёрного списка токенов.
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(
                Map.of("message", "Logged out successfully")
        );
    }
}