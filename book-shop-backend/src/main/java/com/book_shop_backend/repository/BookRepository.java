package com.book_shop_backend.repository;

import com.book_shop_backend.entity.Book;
import com.book_shop_backend.entity.Category;
import com.book_shop_backend.enums.BookInStockStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByTitleContainingIgnoreCase(String title);

    List<Book> findByAuthorContainingIgnoreCase(String author);

    List<Book> findByCategory(Category category);

    List<Book> findByInStock(BookInStockStatus inStock);

    List<Book> findByCategoryAndInStock(Category category,
                                        BookInStockStatus inStock);

    List<Book> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(
            String title,
            String author
    );

    List<Book> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseAndInStock(
            String title,
            String author,
            BookInStockStatus inStock
    );

    boolean existsByCategory_Id(Long categoryId);

}