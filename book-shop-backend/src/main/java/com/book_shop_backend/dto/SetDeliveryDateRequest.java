package com.book_shop_backend.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class SetDeliveryDateRequest {

    @NotNull
    private LocalDate deliveryDate;

    public SetDeliveryDateRequest() {
    }

    public LocalDate getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDate deliveryDate) { this.deliveryDate = deliveryDate; }
}