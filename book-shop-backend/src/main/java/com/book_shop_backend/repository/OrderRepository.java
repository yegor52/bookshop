package com.book_shop_backend.repository;

import com.book_shop_backend.entity.Client;
import com.book_shop_backend.entity.Order;
import com.book_shop_backend.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByClientAndStatus(Client client,
                                          OrderStatus status);

    List<Order> findByClient(Client client);

    List<Order> findByClientAndStatusNot(Client client,
                                         OrderStatus status);

    List<Order> findByClientOrderByOrderDateDesc(Client client);

    List<Order> findByClientAndStatusNotOrderByOrderDateDesc(
            Client client,
            OrderStatus status
    );

    List<Order> findByClientAndStatusOrderByOrderDateDesc(
            Client client,
            OrderStatus status
    );

    List<Order> findAllByStatusNotOrderByOrderDateDesc(OrderStatus status);

    List<Order> findAllByEmployee_IdOrderByOrderDateDesc(Long employeeId);

    List<Order> findAllByEmployeeIsNullAndStatusNotOrderByOrderDateDesc(
            OrderStatus status
    );

    Optional<Order> findByIdAndEmployee_Id(
            Long orderId,
            Long employeeId
    );

    List<Order> findAllByEmployee_Id(Long employeeId);

    List<Order> findAllByClient_Id(Long clientId);

    long countByStatus(OrderStatus status);

    @Query("""
       SELECT COALESCE(SUM(o.totalAmount), 0)
       FROM Order o
       WHERE o.status = 'COMPLETED'
       """)
    BigDecimal getTotalRevenue();

    @Query("""
        SELECT COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        WHERE o.status = 'COMPLETED'
        AND CAST(o.orderDate AS DATE) = CURRENT_DATE
        """)
    BigDecimal getTodayRevenue();

    @Query("""
       SELECT COALESCE(SUM(o.totalAmount), 0)
       FROM Order o
       WHERE o.status = 'COMPLETED'
       AND YEAR(o.orderDate) = YEAR(CURRENT_DATE)
       AND MONTH(o.orderDate) = MONTH(CURRENT_DATE)
       """)
    BigDecimal getMonthRevenue();

    @Query("""
       SELECT COALESCE(SUM(o.totalAmount), 0)
       FROM Order o
       WHERE o.status = 'COMPLETED'
       AND YEAR(o.orderDate) = YEAR(CURRENT_DATE)
       """)
    BigDecimal getYearRevenue();



}