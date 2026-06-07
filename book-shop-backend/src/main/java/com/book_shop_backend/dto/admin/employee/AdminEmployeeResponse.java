package com.book_shop_backend.dto.admin.employee;

public class AdminEmployeeResponse {

    private Long id;
    private Long userId;
    private String fio;
    private String position;
    private String phoneNumber;
    private String email;
    private String role;        // ← добавить поле
    private String login;       // ← добавить поле (нужно для таблицы)
    private Integer ordersCount; // ← добавить поле (если хочешь показывать)

    public AdminEmployeeResponse() {}

    public AdminEmployeeResponse(Long id, Long userId, String fio, String position,
                                 String phoneNumber, String email,
                                 String role, String login) {
        this.id = id;
        this.userId = userId;
        this.fio = fio;
        this.position = position;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.role = role;
        this.login = login;
    }

    // getters + setters для всех полей
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFio() { return fio; }
    public void setFio(String fio) { this.fio = fio; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public Integer getOrdersCount() { return ordersCount; }
    public void setOrdersCount(Integer ordersCount) { this.ordersCount = ordersCount; }
}