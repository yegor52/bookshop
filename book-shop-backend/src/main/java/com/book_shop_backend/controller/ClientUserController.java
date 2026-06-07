package com.book_shop_backend.controller;

import com.book_shop_backend.dto.ClientProfileResponse;
import com.book_shop_backend.dto.UpdateClientProfileRequest;
import com.book_shop_backend.dto.UpdateClientProfileResponse;
import com.book_shop_backend.entity.User;
import com.book_shop_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/client")
public class ClientUserController {

    private final UserService userService;

    public ClientUserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * GET /api/client/profile
     * Возвращает профиль текущего клиента.
     */
    @GetMapping("/profile")
    public ResponseEntity<ClientProfileResponse> getClientProfile(
            @AuthenticationPrincipal User user
    ) {
        ClientProfileResponse profile = userService.getClientProfile(user);
        return ResponseEntity.ok(profile);
    }

    /**
     * PUT /api/client/profile
     * Обновляет ФИО, телефон и email клиента.
     */
    @PutMapping("/profile")
    public ResponseEntity<UpdateClientProfileResponse> updateClientProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateClientProfileRequest request
    ) {
        UpdateClientProfileResponse updated =
                userService.updateClientProfile(user, request);
        return ResponseEntity.ok(updated);
    }
}