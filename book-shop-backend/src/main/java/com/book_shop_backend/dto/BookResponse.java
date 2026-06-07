package com.book_shop_backend.dto;

import java.math.BigDecimal;

public class BookResponse {

    private Long id;
    private String title;
    private String author;
    private BigDecimal price;
    private String inStock;
    private Long categoryId;
    private String categoryName;
    private String description;

    public BookResponse() {
    }

    public BookResponse(Long id,
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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getInStock() { return inStock; }
    public void setInStock(String inStock) { this.inStock = inStock; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}