package com.book_shop_backend.controller;

import com.book_shop_backend.dto.manager.ManagerOrderDetailsResponse;
import com.book_shop_backend.dto.manager.ManagerOrderResponse;
import com.book_shop_backend.dto.manager.UpdateManagerOrderRequest;
import com.book_shop_backend.entity.User;
import com.book_shop_backend.service.ManagerOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager/orders")
public class ManagerOrderController {

    private final ManagerOrderService managerOrderService;

    public ManagerOrderController(
            ManagerOrderService managerOrderService
    ) {
        this.managerOrderService = managerOrderService;
    }

    /**
     * Все заказы.
     */
    @GetMapping
    public ResponseEntity<List<ManagerOrderResponse>> getAllOrders() {

        return ResponseEntity.ok(
                managerOrderService.getAllOrders()
        );
    }

    /**
     * Заказы текущего менеджера.
     */
    @GetMapping("/my")
    public ResponseEntity<List<ManagerOrderResponse>> getMyOrders(
            @AuthenticationPrincipal User user
    ) {

        return ResponseEntity.ok(
                managerOrderService.getMyOrders(user)
        );
    }

    /**
     * Заказы без менеджера.
     */
    @GetMapping("/unassigned")
    public ResponseEntity<List<ManagerOrderResponse>>
    getUnassignedOrders() {

        return ResponseEntity.ok(
                managerOrderService.getUnassignedOrders()
        );
    }

    /**
     * Детальная информация о заказе.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ManagerOrderDetailsResponse>
    getOrderDetails(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                managerOrderService.getOrderDetails(id)
        );
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<ManagerOrderResponse>
    assignOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                managerOrderService.assignOrder(id, user)
        );
    }
    @PatchMapping("/{id}")
    public ResponseEntity<ManagerOrderDetailsResponse>
    updateOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal User user,
            @RequestBody UpdateManagerOrderRequest request
    ) {

        return ResponseEntity.ok(
                managerOrderService.updateOrder(
                        id,
                        user,
                        request
                )
        );
    }
}