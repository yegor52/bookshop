package com.book_shop_backend.dto.admin.statistics;

import java.math.BigDecimal;

public class RevenueStatisticsResponse {

    private BigDecimal revenue;

    public RevenueStatisticsResponse() {
    }

    public RevenueStatisticsResponse(
            BigDecimal revenue
    ) {
        this.revenue = revenue;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }
}