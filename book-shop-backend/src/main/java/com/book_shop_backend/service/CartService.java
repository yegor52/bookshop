package com.book_shop_backend.service;

import com.book_shop_backend.dto.*;
import com.book_shop_backend.entity.*;
import com.book_shop_backend.enums.BookInStockStatus;
import com.book_shop_backend.enums.OrderStatus;
import com.book_shop_backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final ClientRepository clientRepository;
    private final OrderRepository orderRepository;
    private final CompositionRepository compositionRepository;
    private final BookRepository bookRepository;

    public CartService(ClientRepository clientRepository,
                           OrderRepository orderRepository,
                           CompositionRepository compositionRepository,
                           BookRepository bookRepository) {
        this.clientRepository = clientRepository;
        this.orderRepository = orderRepository;
        this.compositionRepository = compositionRepository;
        this.bookRepository = bookRepository;
    }

    // -------------------------------------------------------
    // GET CART
    // -------------------------------------------------------


    public CartResponse getCart(User user) {
        Client client = getClient(user);

        return orderRepository
                .findByClientAndStatus(client, OrderStatus.BASKET)
                .map(this::toCartResponse)
                .orElseGet(() -> new CartResponse(null, null, null, BigDecimal.ZERO, List.of()));
    }

    // -------------------------------------------------------
    // ADD TO CART
    // -------------------------------------------------------


    @Transactional
    public CartResponse addToCart(User user, AddToCartRequest request) {
        Client client = getClient(user);

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found: " + request.getBookId()));

        if (book.getInStock() == BookInStockStatus.NO) {
            throw new RuntimeException("Book is out of stock: " + book.getTitle());
        }

        // Найти или создать корзину
        Order cart = orderRepository
                .findByClientAndStatus(client, OrderStatus.BASKET)
                .orElseGet(() -> createBasket(client));

        // Если книга уже в корзине — увеличиваем количество
        compositionRepository.findByOrderAndBook(cart, book)
                .ifPresentOrElse(
                        existing -> {
                            int newQty = existing.getQuantity() + request.getQuantity();
                            existing.setQuantity(newQty);
                            existing.setTotalPrice(
                                    book.getPrice().multiply(BigDecimal.valueOf(newQty))
                            );
                            compositionRepository.save(existing);
                        },
                        () -> {
                            Composition composition = new Composition();
                            composition.setOrder(cart);
                            composition.setBook(book);
                            composition.setQuantity(request.getQuantity());
                            composition.setTotalPrice(
                                    book.getPrice().multiply(BigDecimal.valueOf(request.getQuantity()))
                            );
                            compositionRepository.save(composition);
                        }
                );

        recalculateTotalAmount(cart);
        return toCartResponse(cart);
    }

    // -------------------------------------------------------
    // UPDATE CART ITEM
    // -------------------------------------------------------


    @Transactional
    public CartResponse updateCartItem(User user, Long compositionId, UpdateCartItemRequest request) {
        Client client = getClient(user);
        Order cart = getBasket(client);

        Composition composition = compositionRepository.findById(compositionId)
                .orElseThrow(() -> new RuntimeException("Cart item not found: " + compositionId));

        // Проверяем, что позиция принадлежит корзине текущего клиента
        if (!composition.getOrder().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to current client");
        }

        composition.setQuantity(request.getQuantity());
        composition.setTotalPrice(
                composition.getBook().getPrice()
                        .multiply(BigDecimal.valueOf(request.getQuantity()))
        );
        compositionRepository.save(composition);

        recalculateTotalAmount(cart);
        return toCartResponse(cart);
    }

    // -------------------------------------------------------
    // REMOVE CART ITEM
    // -------------------------------------------------------


    @Transactional
    public void removeCartItem(User user, Long compositionId) {
        Client client = getClient(user);
        Order cart = getBasket(client);

        Composition composition = compositionRepository.findById(compositionId)
                .orElseThrow(() -> new RuntimeException("Cart item not found: " + compositionId));

        if (!composition.getOrder().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to current client");
        }

        compositionRepository.delete(composition);
        recalculateTotalAmount(cart);
    }

    // -------------------------------------------------------
    // SET DELIVERY DATE
    // -------------------------------------------------------


    @Transactional
    public CartResponse setDeliveryDate(User user, SetDeliveryDateRequest request) {
        Client client = getClient(user);
        Order cart = getBasket(client);

        cart.setDeliveryDate(request.getDeliveryDate());
        orderRepository.save(cart);

        return toCartResponse(cart);
    }

    // -------------------------------------------------------
    // CHECKOUT
    // -------------------------------------------------------


    @Transactional
    public CheckoutResponse checkout(User user) {
        Client client = getClient(user);
        Order cart = getBasket(client);

        List<Composition> items = compositionRepository.findByOrder(cart);

        if (items.isEmpty()) {
            throw new RuntimeException("Cannot checkout: cart is empty");
        }

        if (cart.getDeliveryDate() == null) {
            throw new RuntimeException("Cannot checkout: delivery date is not set");
        }

        // Пересчитываем итог на актуальных ценах
        BigDecimal total = items.stream()
                .map(c -> c.getBook().getPrice()
                        .multiply(BigDecimal.valueOf(c.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalAmount(total);
        cart.setStatus(OrderStatus.CREATED);
        orderRepository.save(cart);

        return new CheckoutResponse(
                cart.getId(),
                cart.getStatus().name(),
                cart.getTotalAmount(),
                cart.getDeliveryDate()
        );
    }

    // -------------------------------------------------------
    // HELPERS
    // -------------------------------------------------------

    private Client getClient(User user) {
        return clientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Client not found for user: " + user.getId()));
    }

    private Order getBasket(Client client) {
        return orderRepository.findByClientAndStatus(client, OrderStatus.BASKET)
                .orElseThrow(() -> new RuntimeException("Active cart not found"));
    }

    private Order createBasket(Client client) {
        Order order = new Order();
        order.setClient(client);
        order.setStatus(OrderStatus.BASKET);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(BigDecimal.ZERO);
        return orderRepository.save(order);
    }

    /**
     * Пересчитывает и сохраняет totalAmount заказа на основе текущих позиций.
     */
    private void recalculateTotalAmount(Order cart) {
        List<Composition> items = compositionRepository.findByOrder(cart);
        BigDecimal total = items.stream()
                .map(Composition::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalAmount(total);
        orderRepository.save(cart);
    }

    private CartResponse toCartResponse(Order order) {
        List<CartItemResponse> items = compositionRepository.findByOrder(order)
                .stream()
                .map(c -> new CartItemResponse(
                        c.getId(),
                        c.getBook().getId(),
                        c.getBook().getTitle(),
                        c.getBook().getAuthor(),
                        c.getBook().getPrice(),
                        c.getQuantity(),
                        c.getTotalPrice()
                ))
                .collect(Collectors.toList());

        return new CartResponse(
                order.getId(),
                order.getStatus().name(),
                order.getDeliveryDate(),
                order.getTotalAmount(),
                items
        );
    }
}