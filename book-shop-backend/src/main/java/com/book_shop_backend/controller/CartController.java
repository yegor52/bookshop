package com.book_shop_backend.controller;

import com.book_shop_backend.dto.*;
import com.book_shop_backend.entity.User;
import com.book_shop_backend.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/client/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * GET /api/client/cart
     * Возвращает текущую корзину клиента со всеми позициями.
     */
    @GetMapping
    public ResponseEntity<CartResponse> getCart(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(cartService.getCart(user));
    }

    /**
     * POST /api/client/cart/items
     * Добавляет книгу в корзину. Создаёт корзину, если её нет.
     * Если книга уже в корзине — увеличивает количество.
     */
    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AddToCartRequest request
    ) {
        return ResponseEntity.ok(cartService.addToCart(user, request));
    }

    /**
     * PUT /api/client/cart/items/{compositionId}
     * Изменяет количество конкретной позиции в корзине.
     */
    @PutMapping("/items/{compositionId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long compositionId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        return ResponseEntity.ok(cartService.updateCartItem(user, compositionId, request));
    }

    /**
     * DELETE /api/client/cart/items/{compositionId}
     * Удаляет позицию из корзины.
     */
    @DeleteMapping("/items/{compositionId}")
    public ResponseEntity<Void> removeCartItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long compositionId
    ) {
        cartService.removeCartItem(user, compositionId);
        return ResponseEntity.noContent().build();
    }

    /**
     * PATCH /api/client/cart/delivery-date
     * Устанавливает дату доставки.
     */
    @PatchMapping("/delivery-date")
    public ResponseEntity<CartResponse> setDeliveryDate(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody SetDeliveryDateRequest request
    ) {
        return ResponseEntity.ok(cartService.setDeliveryDate(user, request));
    }

    /**
     * POST /api/client/cart/checkout
     * Оформляет заказ: BASKET → CREATED.
     */
    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> checkout(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(cartService.checkout(user));
    }
}