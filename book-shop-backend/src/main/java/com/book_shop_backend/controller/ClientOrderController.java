package com.book_shop_backend.controller;

import com.book_shop_backend.dto.OrderResponse;
import com.book_shop_backend.entity.User;
import com.book_shop_backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/client/orders")
public class ClientOrderController {

    private final OrderService orderService;

    public ClientOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * GET /api/client/orders
     * История заказов клиента (без BASKET), новые сверху, с составом.
     */
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(orderService.getClientOrders(user));
    }
}