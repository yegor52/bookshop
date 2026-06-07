package com.book_shop_backend.dto.admin.statistics;

import java.math.BigDecimal;
import java.util.List;

public class AdminDashboardStatisticsResponse {

    private long totalOrders;
    private long completedOrders;
    private long cancelledOrders;
    private long processingOrders;

    private long totalClients;
    private long totalEmployees;
    private long totalBooks;

    private BigDecimal totalRevenue;
    private BigDecimal averageCheck;        // Новое

    private String topCategory;             // Новое
    private long topCategorySales;          // Новое

    private List<TopAuthorResponse> topAuthors; // Новое

    public AdminDashboardStatisticsResponse() {
    }

    public AdminDashboardStatisticsResponse(
            long totalOrders,
            long completedOrders,
            long cancelledOrders,
            long processingOrders,
            long totalClients,
            long totalEmployees,
            long totalBooks,
            BigDecimal totalRevenue,
            BigDecimal averageCheck,
            String topCategory,
            long topCategorySales,
            List<TopAuthorResponse> topAuthors
    ) {
        this.totalOrders = totalOrders;
        this.completedOrders = completedOrders;
        this.cancelledOrders = cancelledOrders;
        this.processingOrders = processingOrders;
        this.totalClients = totalClients;
        this.totalEmployees = totalEmployees;
        this.totalBooks = totalBooks;
        this.totalRevenue = totalRevenue;
        this.averageCheck = averageCheck;
        this.topCategory = topCategory;
        this.topCategorySales = topCategorySales;
        this.topAuthors = topAuthors;
    }

    // ==================== GETTERS ====================
    public long getTotalOrders() { return totalOrders; }
    public long getCompletedOrders() { return completedOrders; }
    public long getCancelledOrders() { return cancelledOrders; }
    public long getProcessingOrders() { return processingOrders; }
    public long getTotalClients() { return totalClients; }
    public long getTotalEmployees() { return totalEmployees; }
    public long getTotalBooks() { return totalBooks; }
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public BigDecimal getAverageCheck() { return averageCheck; }
    public String getTopCategory() { return topCategory; }
    public long getTopCategorySales() { return topCategorySales; }
    public List<TopAuthorResponse> getTopAuthors() { return topAuthors; }

    // ==================== SETTERS ====================
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
    public void setCompletedOrders(long completedOrders) { this.completedOrders = completedOrders; }
    public void setCancelledOrders(long cancelledOrders) { this.cancelledOrders = cancelledOrders; }
    public void setProcessingOrders(long processingOrders) { this.processingOrders = processingOrders; }
    public void setTotalClients(long totalClients) { this.totalClients = totalClients; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }
    public void setTotalBooks(long totalBooks) { this.totalBooks = totalBooks; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
    public void setAverageCheck(BigDecimal averageCheck) { this.averageCheck = averageCheck; }
    public void setTopCategory(String topCategory) { this.topCategory = topCategory; }
    public void setTopCategorySales(long topCategorySales) { this.topCategorySales = topCategorySales; }
    public void setTopAuthors(List<TopAuthorResponse> topAuthors) { this.topAuthors = topAuthors; }
}