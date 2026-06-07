package com.book_shop_backend.service;

import com.book_shop_backend.dto.admin.statistics.AdminDashboardStatisticsResponse;
import com.book_shop_backend.dto.admin.statistics.RevenueStatisticsResponse;
import com.book_shop_backend.dto.admin.statistics.TopAuthorResponse;
import com.book_shop_backend.dto.admin.statistics.TopSellingBookResponse;
import com.book_shop_backend.enums.OrderStatus;
import com.book_shop_backend.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AdminStatisticsService {

    private final OrderRepository orderRepository;
    private final ClientRepository clientRepository;
    private final EmployeeRepository employeeRepository;
    private final BookRepository bookRepository;
    private final CompositionRepository compositionRepository;

    public AdminStatisticsService(
            OrderRepository orderRepository,
            ClientRepository clientRepository,
            EmployeeRepository employeeRepository,
            BookRepository bookRepository,
            CompositionRepository compositionRepository
    ) {
        this.orderRepository = orderRepository;
        this.clientRepository = clientRepository;
        this.employeeRepository = employeeRepository;
        this.bookRepository = bookRepository;
        this.compositionRepository = compositionRepository;
    }

    public AdminDashboardStatisticsResponse getDashboardStatistics() {

        long totalOrders = orderRepository.count();
        long completedOrders = orderRepository.countByStatus(OrderStatus.COMPLETED);
        long cancelledOrders = orderRepository.countByStatus(OrderStatus.CANCELLED);
        long processingOrders = orderRepository.countByStatus(OrderStatus.IN_TRANSIT);

        long totalClients = clientRepository.count();
        long totalEmployees = employeeRepository.count();
        long totalBooks = bookRepository.count();

        BigDecimal totalRevenue = orderRepository.getTotalRevenue();

        // Средний чек
        BigDecimal averageCheck = totalOrders > 0
                ? totalRevenue.divide(BigDecimal.valueOf(totalOrders), 2, BigDecimal.ROUND_HALF_UP)
                : BigDecimal.ZERO;

        // Топ категория
        List<Object[]> topCategoryResult = compositionRepository.getTopCategory();
        String topCategory = topCategoryResult.isEmpty() ? "Нет данных" : (String) topCategoryResult.get(0)[0];
        long topCategorySales = topCategoryResult.isEmpty() ? 0 : ((Number) topCategoryResult.get(0)[1]).longValue();

        // Топ-3 авторов
        List<TopAuthorResponse> topAuthors = compositionRepository.getTopAuthors()
                .stream()
                .limit(3)
                .map(row -> new TopAuthorResponse(
                        (String) row[0],
                        ((Number) row[1]).longValue(),
                        (BigDecimal) row[2]
                ))
                .toList();

        return new AdminDashboardStatisticsResponse(
                totalOrders,
                completedOrders,
                cancelledOrders,
                processingOrders,
                totalClients,
                totalEmployees,
                totalBooks,
                totalRevenue,
                averageCheck,
                topCategory,
                topCategorySales,
                topAuthors
        );
    }

    public RevenueStatisticsResponse getTodayRevenue() {
        return new RevenueStatisticsResponse(orderRepository.getTodayRevenue());
    }

    public RevenueStatisticsResponse getMonthRevenue() {
        return new RevenueStatisticsResponse(orderRepository.getMonthRevenue());
    }

    public RevenueStatisticsResponse getYearRevenue() {
        return new RevenueStatisticsResponse(orderRepository.getYearRevenue());
    }

    public List<TopSellingBookResponse> getTopSellingBooks() {
        return compositionRepository
                .getTopSellingBooks()
                .stream()
                .map(row -> new TopSellingBookResponse(
                        ((Number) row[0]).longValue(),
                        (String) row[1],
                        (String) row[2],
                        ((Number) row[3]).longValue(),
                        (BigDecimal) row[4]
                ))
                .toList();
    }
}