package com.book_shop_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class CartResponse {

    private Long orderId;
    private String status;
    private LocalDate deliveryDate;
    private BigDecimal totalAmount;
    private List<CartItemResponse> items;

    public CartResponse() {
    }

    public CartResponse(Long orderId,
                        String status,
                        LocalDate deliveryDate,
                        BigDecimal totalAmount,
                        List<CartItemResponse> items) {
        this.orderId = orderId;
        this.status = status;
        this.deliveryDate = deliveryDate;
        this.totalAmount = totalAmount;
        this.items = items;
    }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDate deliveryDate) { this.deliveryDate = deliveryDate; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public List<CartItemResponse> getItems() { return items; }
    public void setItems(List<CartItemResponse> items) { this.items = items; }
}