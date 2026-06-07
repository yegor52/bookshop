package com.book_shop_backend.service;

import com.book_shop_backend.dto.CartItemResponse;
import com.book_shop_backend.dto.OrderResponse;
import com.book_shop_backend.entity.Client;
import com.book_shop_backend.entity.Composition;
import com.book_shop_backend.entity.Order;
import com.book_shop_backend.entity.User;
import com.book_shop_backend.enums.OrderStatus;
import com.book_shop_backend.repository.ClientRepository;
import com.book_shop_backend.repository.CompositionRepository;
import com.book_shop_backend.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final ClientRepository clientRepository;
    private final OrderRepository orderRepository;
    private final CompositionRepository compositionRepository;

    public OrderService(ClientRepository clientRepository,
                            OrderRepository orderRepository,
                            CompositionRepository compositionRepository) {
        this.clientRepository = clientRepository;
        this.orderRepository = orderRepository;
        this.compositionRepository = compositionRepository;
    }

    public List<OrderResponse> getClientOrders(User user) {
        Client client = clientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Client not found for user: " + user.getId()));

        // Все заказы кроме BASKET, новые сверху
        List<Order> orders = orderRepository
                .findByClientAndStatusNotOrderByOrderDateDesc(client, OrderStatus.BASKET);

        return orders.stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }


    private OrderResponse toOrderResponse(Order order) {
        List<CartItemResponse> items = compositionRepository.findByOrder(order)
                .stream()
                .map(this::toItemResponse)
                .collect(Collectors.toList());

        return new OrderResponse(
                order.getId(),
                order.getOrderDate(),
                order.getDeliveryDate(),
                order.getStatus().name(),
                order.getTotalAmount(),
                items
        );
    }

    private CartItemResponse toItemResponse(Composition c) {
        return new CartItemResponse(
                c.getId(),
                c.getBook().getId(),
                c.getBook().getTitle(),
                c.getBook().getAuthor(),
                c.getBook().getPrice(),
                c.getQuantity(),
                c.getTotalPrice()
        );
    }
}