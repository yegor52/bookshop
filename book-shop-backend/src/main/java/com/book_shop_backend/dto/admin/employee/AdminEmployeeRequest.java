package com.book_shop_backend.dto.admin.employee;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AdminEmployeeRequest {

    @NotNull
    private Long userId;

    @NotBlank
    private String fio;

    @NotBlank
    private String position;

    @NotBlank
    private String phoneNumber;

    @NotBlank
    private String email;

    public AdminEmployeeRequest() {}

    public Long getUserId() {
        return userId;
    }

    public String getFio() {
        return fio;
    }

    public String getPosition() {
        return position;
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

    public void setPosition(String position) {
        this.position = position;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}