package com.book_shop_backend.dto;

import java.math.BigDecimal;

public class CartItemResponse {

    private Long compositionId;
    private Long bookId;
    private String title;
    private String author;
    private BigDecimal pricePerUnit;
    private Integer quantity;
    private BigDecimal totalPrice;

    public CartItemResponse() {
    }

    public CartItemResponse(Long compositionId,
                            Long bookId,
                            String title,
                            String author,
                            BigDecimal pricePerUnit,
                            Integer quantity,
                            BigDecimal totalPrice) {
        this.compositionId = compositionId;
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.pricePerUnit = pricePerUnit;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
    }

    public Long getCompositionId() { return compositionId; }
    public void setCompositionId(Long compositionId) { this.compositionId = compositionId; }

    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public BigDecimal getPricePerUnit() { return pricePerUnit; }
    public void setPricePerUnit(BigDecimal pricePerUnit) { this.pricePerUnit = pricePerUnit; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
}