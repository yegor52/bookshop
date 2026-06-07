package com.book_shop_backend.dto.admin.employee;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AdminEmployeeRegisterRequest {

    @NotBlank
    private String login;

    @NotBlank
    private String password;

    @NotBlank
    private String fio;

    @NotBlank
    private String phoneNumber;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String role; // ADMIN или MANAGER

    @NotBlank
    private String position; // WORKING, VACATION и т.д.

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFio() { return fio; }
    public void setFio(String fio) { this.fio = fio; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }
}