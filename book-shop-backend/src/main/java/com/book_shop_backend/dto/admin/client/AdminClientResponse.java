package com.book_shop_backend.dto.admin.client;

public class AdminClientResponse {

    private Long id;

    private Long userId;

    private String fio;

    private String phoneNumber;

    private String email;

    public AdminClientResponse() {
    }

    public AdminClientResponse(Long id,
                               Long userId,
                               String fio,
                               String phoneNumber,
                               String email) {
        this.id = id;
        this.userId = userId;
        this.fio = fio;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }

    public Long getId() {
        return id;
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

    public void setId(Long id) {
        this.id = id;
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