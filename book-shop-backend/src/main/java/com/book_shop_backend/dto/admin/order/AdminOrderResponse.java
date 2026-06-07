package com.book_shop_backend.dto.admin.order;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class AdminOrderResponse {

    private Long id;

    private String clientName;

    private String employeeName;

    private String status;

    private LocalDateTime orderDate;

    private LocalDate deliveryDate;

    private BigDecimal totalAmount;

    public AdminOrderResponse() {
    }

    public AdminOrderResponse(
            Long id,
            String clientName,
            String employeeName,
            String status,
            LocalDateTime orderDate,
            LocalDate deliveryDate,
            BigDecimal totalAmount
    ) {
        this.id = id;
        this.clientName = clientName;
        this.employeeName = employeeName;
        this.status = status;
        this.orderDate = orderDate;
        this.deliveryDate = deliveryDate;
        this.totalAmount = totalAmount;
    }

    public Long getId() {
        return id;
    }

    public String getClientName() {
        return clientName;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public LocalDate getDeliveryDate() {
        return deliveryDate;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public void setDeliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}