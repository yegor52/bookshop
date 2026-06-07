package com.book_shop_backend.dto.admin.client;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AdminClientRequest {

    @NotNull
    private Long userId;

    @NotBlank
    private String fio;

    @NotBlank
    private String phoneNumber;

    @NotBlank
    private String email;

    public AdminClientRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public String getFio() {
        return fio;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setFio(String fio) {
        this.fio = fio;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}