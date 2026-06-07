package com.book_shop_backend.service;

import com.book_shop_backend.dto.BookResponse;
import com.book_shop_backend.entity.Book;
import com.book_shop_backend.entity.Category;
import com.book_shop_backend.enums.BookInStockStatus;
import com.book_shop_backend.repository.BookRepository;
import com.book_shop_backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public BookService(BookRepository bookRepository,
                           CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
    }


    public List<BookResponse> getBooks(String search, Long categoryId, String inStock) {

        // Резолвим опциональные фильтры
        Category category = null;
        if (categoryId != null) {
            category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found: " + categoryId));
        }

        BookInStockStatus stockStatus = null;
        if (inStock != null && !inStock.isBlank()) {
            stockStatus = BookInStockStatus.valueOf(inStock.toUpperCase());
        }

        List<Book> books;

        // Выбираем наиболее подходящий метод репозитория
        if (search != null && !search.isBlank()) {
            if (stockStatus != null) {
                books = bookRepository
                        .findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseAndInStock(
                                search, search, stockStatus
                        );
            } else {
                books = bookRepository
                        .findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(
                                search, search
                        );
            }
            // Дополнительная фильтрация по категории в памяти,
            // чтобы не городить лишние методы репозитория
            if (category != null) {
                final Category cat = category;
                books = books.stream()
                        .filter(b -> b.getCategory().getId().equals(cat.getId()))
                        .collect(Collectors.toList());
            }
        } else if (category != null && stockStatus != null) {
            books = bookRepository.findByCategoryAndInStock(category, stockStatus);
        } else if (category != null) {
            books = bookRepository.findByCategory(category);
        } else if (stockStatus != null) {
            books = bookRepository.findByInStock(stockStatus);
        } else {
            books = bookRepository.findAll();
        }

        return books.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }


    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found: " + id));
        return toResponse(book);
    }

    // -------------------------------------------------------

    private BookResponse toResponse(Book book) {
        return new BookResponse(
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