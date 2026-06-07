package com.book_shop_backend.dto.admin.book;

import java.math.BigDecimal;

public class AdminBookResponse {

    private Long id;

    private String title;

    private String author;

    private BigDecimal price;

    private String inStock;

    private Long categoryId;

    private String categoryName;

    private String description;

    public AdminBookResponse() {
    }

    public AdminBookResponse(Long id,
                             String title,
                             String author,
                             BigDecimal price,
                             String inStock,
                             Long categoryId,
                             String categoryName,
                             String description) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.price = price;
        this.inStock = inStock;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getInStock() {
        return inStock;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public String getDescription() {
        return description;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setInStock(String inStock) {
        this.inStock = inStock;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}