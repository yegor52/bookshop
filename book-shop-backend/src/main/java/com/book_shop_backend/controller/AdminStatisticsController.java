package com.book_shop_backend.controller;

import com.book_shop_backend.dto.admin.statistics.AdminDashboardStatisticsResponse;
import com.book_shop_backend.dto.admin.statistics.RevenueStatisticsResponse;
import com.book_shop_backend.dto.admin.statistics.TopSellingBookResponse;
import com.book_shop_backend.service.AdminStatisticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/statistics")
public class AdminStatisticsController {

    private final AdminStatisticsService
            adminStatisticsService;

    public AdminStatisticsController(
            AdminStatisticsService adminStatisticsService
    ) {
        this.adminStatisticsService =
                adminStatisticsService;
    }

    /**
     * Главная статистика dashboard.
     */
    @GetMapping("/overview")
    public AdminDashboardStatisticsResponse
    getOverview() {

        return adminStatisticsService
                .getDashboardStatistics();
    }

    @GetMapping("/revenue/today")
    public RevenueStatisticsResponse
    getTodayRevenue() {

        return adminStatisticsService
                .getTodayRevenue();
    }

    @GetMapping("/revenue/month")
    public RevenueStatisticsResponse
    getMonthRevenue() {

        return adminStatisticsService
                .getMonthRevenue();
    }

    @GetMapping("/revenue/year")
    public RevenueStatisticsResponse
    getYearRevenue() {

        return adminStatisticsService
                .getYearRevenue();
    }

    @GetMapping("/books/top-selling")
    public List<TopSellingBookResponse>
    getTopSellingBooks() {

        return adminStatisticsService
                .getTopSellingBooks();
    }
}