package com.book_shop_backend.dto;
public class UpdateClientProfileResponse {

    private Long clientId;
    private String fullName;
    private String phoneNumber;
    private String email;

    public UpdateClientProfileResponse() {
    }

    public UpdateClientProfileResponse(Long clientId,
                                       String fullName,
                                       String phoneNumber,
                                       String email) {
        this.clientId = clientId;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}