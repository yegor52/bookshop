package com.book_shop_backend.dto;


import java.math.BigDecimal;
import java.time.LocalDate;

public class CheckoutResponse {

    private Long orderId;
    private String status;
    private BigDecimal totalAmount;
    private LocalDate deliveryDate;

    public CheckoutResponse() {
    }

    public CheckoutResponse(Long orderId,
                            String status,
                            BigDecimal totalAmount,
                            LocalDate deliveryDate) {
        this.orderId = orderId;
        this.status = status;
        this.totalAmount = totalAmount;
        this.deliveryDate = deliveryDate;
    }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public LocalDate getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDate deliveryDate) { this.deliveryDate = deliveryDate; }
}