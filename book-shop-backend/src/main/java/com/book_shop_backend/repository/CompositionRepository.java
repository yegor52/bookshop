package com.book_shop_backend.repository;

import com.book_shop_backend.entity.Book;
import com.book_shop_backend.entity.Composition;
import com.book_shop_backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CompositionRepository extends JpaRepository<Composition, Long> {

    List<Composition> findByOrder(Order order);

    Optional<Composition> findByOrderAndBook(Order order, Book book);

    boolean existsByOrderAndBook(Order order, Book book);

    void deleteByOrderAndBook(Order order, Book book);

    List<Composition> findAllByOrder_Id(Long orderId);

    @Query("""
           SELECT
               c.book.id,
               c.book.title,
               c.book.author,
               SUM(c.quantity),
               SUM(c.totalPrice)
           FROM Composition c
           GROUP BY c.book.id, c.book.title, c.book.author
           ORDER BY SUM(c.quantity) DESC
           """)
    List<Object[]> getTopSellingBooks();

    // ==================== НОВЫЕ ЗАПРОСЫ ====================

    @Query("""
           SELECT c.book.category.name, SUM(c.quantity)
           FROM Composition c
           GROUP BY c.book.category.name
           ORDER BY SUM(c.quantity) DESC
           """)
    List<Object[]> getTopCategory();

    @Query("""
           SELECT c.book.author, SUM(c.quantity), SUM(c.totalPrice)
           FROM Composition c
           GROUP BY c.book.author
           ORDER BY SUM(c.quantity) DESC
           """)
    List<Object[]> getTopAuthors();
}