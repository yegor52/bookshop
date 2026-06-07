package com.book_shop_backend.service;

import com.book_shop_backend.dto.admin.order.AdminOrderResponse;
import com.book_shop_backend.dto.admin.order.AdminOrderUpdateRequest;
import com.book_shop_backend.entity.Employee;
import com.book_shop_backend.entity.Order;
import com.book_shop_backend.enums.OrderStatus;
import com.book_shop_backend.repository.EmployeeRepository;
import com.book_shop_backend.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminOrderService {

    private final OrderRepository orderRepository;
    private final EmployeeRepository employeeRepository;

    public AdminOrderService(
            OrderRepository orderRepository,
            EmployeeRepository employeeRepository
    ) {
        this.orderRepository = orderRepository;
        this.employeeRepository = employeeRepository;
    }

    /**
     * Получить все заказы.
     */
    public List<AdminOrderResponse> getAllOrders() {

        return orderRepository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    /**
     * Получить заказ по id.
     */
    public AdminOrderResponse getOrderById(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );

        return map(order);
    }

    /**
     * Обновить заказ.
     */
    public AdminOrderResponse updateOrder(
            Long id,
            AdminOrderUpdateRequest request
    ) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );

        if (request.getStatus() != null) {

            try {

                OrderStatus status =
                        OrderStatus.valueOf(
                                request.getStatus()
                        );

                order.setStatus(status);

            } catch (IllegalArgumentException e) {

                throw new RuntimeException(
                        "Invalid order status"
                );
            }
        }

        if (request.getDeliveryDate() != null) {

            order.setDeliveryDate(
                    request.getDeliveryDate()
            );
        }

        return map(
                orderRepository.save(order)
        );
    }

    /**
     * Назначить сотрудника на заказ.
     */
    public AdminOrderResponse assignEmployee(
            Long orderId,
            Long employeeId
    ) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );

        Employee employee =
                employeeRepository.findById(employeeId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Employee not found"
                                )
                        );

        order.setEmployee(employee);

        return map(
                orderRepository.save(order)
        );
    }

    private AdminOrderResponse map(Order order) {

        return new AdminOrderResponse(
                order.getId(),
                order.getClient() != null
                        ? order.getClient().getFio()
                        : null,
                order.getEmployee() != null
                        ? order.getEmployee().getFio()
                        : null,
                order.getStatus().name(),
                order.getOrderDate(),
                order.getDeliveryDate(),
                order.getTotalAmount()
        );
    }
}