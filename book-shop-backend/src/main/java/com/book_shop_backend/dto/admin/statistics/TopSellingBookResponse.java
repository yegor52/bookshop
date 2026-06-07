package com.book_shop_backend.dto.admin.statistics;

import java.math.BigDecimal;

public class TopSellingBookResponse {

    private Long bookId;

    private String title;

    private String author;

    private Long totalSold;

    private BigDecimal revenue;

    public TopSellingBookResponse() {
    }

    public TopSellingBookResponse(
            Long bookId,
            String title,
            String author,
            Long totalSold,
            BigDecimal revenue
    ) {
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.totalSold = totalSold;
        this.revenue = revenue;
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

    public Long getTotalSold() {
        return totalSold;
    }

    public BigDecimal getRevenue() {
        return revenue;
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

    public void setTotalSold(Long totalSold) {
        this.totalSold = totalSold;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }
}