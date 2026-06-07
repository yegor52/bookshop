package com.book_shop_backend.service;

import com.book_shop_backend.dto.admin.book.AdminBookRequest;
import com.book_shop_backend.dto.admin.book.AdminBookResponse;
import com.book_shop_backend.entity.Book;
import com.book_shop_backend.entity.Category;
import com.book_shop_backend.enums.BookInStockStatus;
import com.book_shop_backend.repository.BookRepository;
import com.book_shop_backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminBookService {

    private final BookRepository bookRepository;

    private final CategoryRepository categoryRepository;

    public AdminBookService(BookRepository bookRepository,
                            CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
    }

    /**
     * Получить все книги.
     */
    public List<AdminBookResponse> getAllBooks() {

        return bookRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Получить книгу по id.
     */
    public AdminBookResponse getBookById(Long id) {

        Book book = bookRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Book not found")
                );

        return mapToResponse(book);
    }

    /**
     * Создать книгу.
     */
    public AdminBookResponse createBook(
            AdminBookRequest request
    ) {

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found")
                );

        BookInStockStatus inStockStatus;

        try {

            inStockStatus = BookInStockStatus.valueOf(
                    request.getInStock()
            );

        } catch (IllegalArgumentException e) {

            throw new RuntimeException(
                    "Invalid stock status"
            );
        }

        Book book = new Book();

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setPrice(request.getPrice());
        book.setInStock(inStockStatus);
        book.setCategory(category);
        book.setDescription(request.getDescription());

        Book saved = bookRepository.save(book);

        return mapToResponse(saved);
    }

    /**
     * Обновить книгу.
     */
    public AdminBookResponse updateBook(
            Long id,
            AdminBookRequest request
    ) {

        Book book = bookRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Book not found")
                );

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found")
                );

        BookInStockStatus inStockStatus;

        try {

            inStockStatus = BookInStockStatus.valueOf(
                    request.getInStock()
            );

        } catch (IllegalArgumentException e) {

            throw new RuntimeException(
                    "Invalid stock status"
            );
        }

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setPrice(request.getPrice());
        book.setInStock(inStockStatus);
        book.setCategory(category);
        book.setDescription(request.getDescription());

        Book updated = bookRepository.save(book);

        return mapToResponse(updated);
    }

    /**
     * Удалить книгу.
     */
    public void deleteBook(Long id) {

        Book book = bookRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Book not found")
                );

        bookRepository.delete(book);
    }

    private AdminBookResponse mapToResponse(Book book) {

        return new AdminBookResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getPrice(),
                book.getInStock().name(),
                book.getCategory().getId(),
                book.getCategory().getName(),
                book.getDescription()
        );
    }
}