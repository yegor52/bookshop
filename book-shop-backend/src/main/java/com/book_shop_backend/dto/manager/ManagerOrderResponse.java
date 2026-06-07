package com.book_shop_backend.dto.manager;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ManagerOrderResponse {

    private Long id;

    private LocalDateTime orderDate;

    private LocalDate deliveryDate;

    private String status;

    private BigDecimal totalAmount;

    private ManagerClientShortResponse client;

    private ManagerEmployeeShortResponse manager;

    private Integer totalBooks;     // ← Добавлено

    public ManagerOrderResponse() {
    }

    public ManagerOrderResponse(Long id,
                                LocalDateTime orderDate,
                                LocalDate deliveryDate,
                                String status,
                                BigDecimal totalAmount,
                                ManagerClientShortResponse client,
                                ManagerEmployeeShortResponse manager) {
        this.id = id;
        this.orderDate = orderDate;
        this.deliveryDate = deliveryDate;
        this.status = status;
        this.totalAmount = totalAmount;
        this.client = client;
        this.manager = manager;
    }

    // ==================== Геттеры и сеттеры ====================

    public Long getId() {
        return id;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public LocalDate getDeliveryDate() {
        return deliveryDate;
    }

    public String getStatus() {
        return status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public ManagerClientShortResponse getClient() {
        return client;
    }

    public ManagerEmployeeShortResponse getManager() {
        return manager;
    }

    public Integer getTotalBooks() {        // ← Новый геттер
        return totalBooks;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public void setDeliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setClient(ManagerClientShortResponse client) {
        this.client = client;
    }

    public void setManager(ManagerEmployeeShortResponse manager) {
        this.manager = manager;
    }

    public void setTotalBooks(Integer totalBooks) {     // ← Новый сеттер
        this.totalBooks = totalBooks;
    }
}