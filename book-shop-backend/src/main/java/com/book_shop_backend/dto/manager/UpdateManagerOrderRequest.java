package com.book_shop_backend.dto.manager;

import jakarta.validation.constraints.Future;

import java.time.LocalDate;

public class UpdateManagerOrderRequest {

    private String status;

    @Future
    private LocalDate deliveryDate;

    public UpdateManagerOrderRequest() {
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