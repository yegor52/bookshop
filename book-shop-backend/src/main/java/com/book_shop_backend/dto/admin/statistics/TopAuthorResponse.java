package com.book_shop_backend.dto.admin.statistics;

import java.math.BigDecimal;

public class TopAuthorResponse {

    private String author;
    private Long totalSold;
    private BigDecimal revenue;

    public TopAuthorResponse() {
    }

    public TopAuthorResponse(String author, Long totalSold, BigDecimal revenue) {
        this.author = author;
        this.totalSold = totalSold;
        this.revenue = revenue;
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