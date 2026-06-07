package com.book_shop_backend.service;

import com.book_shop_backend.dto.manager.ManagerClientShortResponse;
import com.book_shop_backend.dto.manager.ManagerEmployeeShortResponse;
import com.book_shop_backend.dto.manager.ManagerOrderDetailsResponse;
import com.book_shop_backend.dto.manager.ManagerOrderItemResponse;
import com.book_shop_backend.dto.manager.UpdateManagerOrderRequest;
import com.book_shop_backend.dto.manager.ManagerOrderResponse;
import com.book_shop_backend.entity.Composition;
import com.book_shop_backend.entity.Employee;
import com.book_shop_backend.entity.Order;
import com.book_shop_backend.entity.User;
import com.book_shop_backend.enums.OrderStatus;
import com.book_shop_backend.repository.CompositionRepository;
import com.book_shop_backend.repository.EmployeeRepository;
import com.book_shop_backend.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ManagerOrderService {

    private final OrderRepository orderRepository;
    private final EmployeeRepository employeeRepository;
    private final CompositionRepository compositionRepository;

    public ManagerOrderService(OrderRepository orderRepository,
                               EmployeeRepository employeeRepository,
                               CompositionRepository compositionRepository) {
        this.orderRepository = orderRepository;
        this.employeeRepository = employeeRepository;
        this.compositionRepository = compositionRepository;
    }

    /**
     * Все заказы кроме корзин.
     */
    public List<ManagerOrderResponse> getAllOrders() {
        List<Order> orders = orderRepository
                .findAllByStatusNotOrderByOrderDateDesc(OrderStatus.BASKET);

        return orders.stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    /**
     * Заказы текущего менеджера.
     */
    public List<ManagerOrderResponse> getMyOrders(User user) {
        Employee employee = employeeRepository
                .findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Employee not found for user: " + user.getLogin()));

        List<Order> orders = orderRepository
                .findAllByEmployee_IdOrderByOrderDateDesc(employee.getId());

        return orders.stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    /**
     * Заказы без менеджера.
     */
    public List<ManagerOrderResponse> getUnassignedOrders() {
        List<Order> orders = orderRepository
                .findAllByEmployeeIsNullAndStatusNotOrderByOrderDateDesc(OrderStatus.BASKET);

        return orders.stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    /**
     * Детальная информация о заказе.
     */
    public ManagerOrderDetailsResponse getOrderDetails(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() == OrderStatus.BASKET) {
            throw new RuntimeException("Basket order is not available");
        }

        List<Composition> compositions = compositionRepository.findAllByOrder_Id(orderId);

        List<ManagerOrderItemResponse> items = compositions.stream()
                .map(this::mapToOrderItemResponse)
                .toList();

        ManagerOrderDetailsResponse response = new ManagerOrderDetailsResponse();
        response.setId(order.getId());
        response.setOrderDate(order.getOrderDate());
        response.setDeliveryDate(order.getDeliveryDate());
        response.setStatus(order.getStatus().name());
        response.setTotalAmount(order.getTotalAmount());
        response.setClient(mapToClientResponse(order));
        response.setManager(mapToEmployeeResponse(order));
        response.setItems(items);

        return response;
    }

    /**
     * Основной маппинг для списка заказов
     */
    private ManagerOrderResponse mapToOrderResponse(Order order) {
        // Подсчёт общего количества книг в заказе
        int totalBooks = compositionRepository.findByOrder(order)
                .stream()
                .mapToInt(Composition::getQuantity)
                .sum();

        ManagerOrderResponse response = new ManagerOrderResponse(
                order.getId(),
                order.getOrderDate(),
                order.getDeliveryDate(),
                order.getStatus().name(),
                order.getTotalAmount(),
                mapToClientResponse(order),
                mapToEmployeeResponse(order)
        );

        response.setTotalBooks(totalBooks);   // ← Важно!

        return response;
    }

    private ManagerOrderItemResponse mapToOrderItemResponse(Composition composition) {
        return new ManagerOrderItemResponse(
                composition.getId(),
                composition.getBook().getId(),
                composition.getBook().getTitle(),
                composition.getBook().getAuthor(),
                composition.getBook().getPrice(),
                composition.getQuantity(),
                composition.getTotalPrice()
        );
    }

    private ManagerClientShortResponse mapToClientResponse(Order order) {
        return new ManagerClientShortResponse(
                order.getClient().getId(),
                order.getClient().getFio(),
                order.getClient().getPhoneNumber(),
                order.getClient().getEmail()
        );
    }

    private ManagerEmployeeShortResponse mapToEmployeeResponse(Order order) {
        if (order.getEmployee() == null) {
            return null;
        }

        return new ManagerEmployeeShortResponse(
                order.getEmployee().getId(),
                order.getEmployee().getFio(),
                order.getEmployee().getPosition()
        );
    }

    // ==================== Остальные методы без изменений ====================

    public ManagerOrderResponse assignOrder(Long orderId, User user) {
        Employee employee = employeeRepository
                .findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() == OrderStatus.BASKET) {
            throw new RuntimeException("Basket order cannot be assigned");
        }

        if (order.getEmployee() != null) {
            throw new RuntimeException("Order already assigned");
        }

        order.setEmployee(employee);
        Order saved = orderRepository.save(order);

        return mapToOrderResponse(saved);
    }

    public ManagerOrderDetailsResponse updateOrder(
            Long orderId, User user, UpdateManagerOrderRequest request) {

        Employee employee = employeeRepository
                .findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Order order = orderRepository
                .findByIdAndEmployee_Id(orderId, employee.getId())
                .orElseThrow(() -> new RuntimeException("Order not found or not assigned to manager"));

        if (order.getStatus() == OrderStatus.BASKET) {
            throw new RuntimeException("Basket order cannot be updated");
        }

        if (request.getStatus() != null) {
            try {
                order.setStatus(OrderStatus.valueOf(request.getStatus()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid order status");
            }
        }

        if (request.getDeliveryDate() != null) {
            order.setDeliveryDate(request.getDeliveryDate());
        }

        Order saved = orderRepository.save(order);
        return getOrderDetails(saved.getId());
    }
}