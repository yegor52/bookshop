package com.book_shop_backend.dto.admin.order;

import jakarta.validation.constraints.Future;

import java.time.LocalDate;

public class AdminOrderUpdateRequest {

    private String status;

    @Future
    private LocalDate deliveryDate;

    public AdminOrderUpdateRequest() {
    }

    public String getStatus() {
        return status;
    }

    public LocalDate getDeliveryDate() {
        return deliveryDate;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setDeliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
    }
}