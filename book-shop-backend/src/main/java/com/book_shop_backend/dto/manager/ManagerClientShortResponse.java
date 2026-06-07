package com.book_shop_backend.dto.manager;

public class ManagerClientShortResponse {

    private Long id;
    private String fio;
    private String phoneNumber;
    private String email;

    public ManagerClientShortResponse() {
    }

    public ManagerClientShortResponse(Long id,
                                      String fio,
                                      String phoneNumber,
                                      String email) {
        this.id = id;
        this.fio = fio;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }

    public Long getId() {
        return id;
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