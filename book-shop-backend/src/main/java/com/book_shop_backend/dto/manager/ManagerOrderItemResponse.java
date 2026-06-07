package com.book_shop_backend.dto.manager;

import java.math.BigDecimal;

public class ManagerOrderItemResponse {

    private Long compositionId;
    private Long bookId;
    private String title;
    private String author;
    private BigDecimal pricePerUnit;
    private Integer quantity;
    private BigDecimal totalPrice;

    public ManagerOrderItemResponse() {
    }

    public ManagerOrderItemResponse(Long compositionId,
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

    public Long getCompositionId() {
        return compositionId;
    }

    public Long getBookId() {
        return bookId;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public BigDecimal getPricePerUnit() {
        return pricePerUnit;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setCompositionId(Long compositionId) {
        this.compositionId = compositionId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public void setPricePerUnit(BigDecimal pricePerUnit) {
        this.pricePerUnit = pricePerUnit;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
}