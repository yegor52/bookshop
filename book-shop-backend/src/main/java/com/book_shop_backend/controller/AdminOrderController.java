package com.book_shop_backend.controller;

import com.book_shop_backend.dto.admin.order.AdminOrderResponse;
import com.book_shop_backend.dto.admin.order.AdminOrderUpdateRequest;
import com.book_shop_backend.service.AdminOrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    public AdminOrderController(
            AdminOrderService adminOrderService
    ) {
        this.adminOrderService = adminOrderService;
    }

    /**
     * Получить все заказы.
     */
    @GetMapping
    public List<AdminOrderResponse> getAllOrders() {

        return adminOrderService.getAllOrders();
    }

    /**
     * Получить заказ по id.
     */
    @GetMapping("/{id}")
    public AdminOrderResponse getOrderById(
            @PathVariable Long id
    ) {

        return adminOrderService.getOrderById(id);
    }

    /**
     * Обновить заказ.
     */
    @PatchMapping("/{id}")
    public ResponseEntity<AdminOrderResponse>
    updateOrder(
            @PathVariable Long id,
            @Valid
            @RequestBody
            AdminOrderUpdateRequest request
    ) {

        return ResponseEntity.ok(
                adminOrderService.updateOrder(
                        id,
                        request
                )
        );
    }

    /**
     * Назначить сотрудника.
     */
    @PatchMapping("/{orderId}/assign/{employeeId}")
    public ResponseEntity<AdminOrderResponse>
    assignEmployee(
            @PathVariable Long orderId,
            @PathVariable Long employeeId
    ) {

        return ResponseEntity.ok(
                adminOrderService.assignEmployee(
                        orderId,
                        employeeId
                )
        );
    }
}