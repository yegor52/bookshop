package com.book_shop_backend.controller;

import com.book_shop_backend.dto.BookResponse;
import com.book_shop_backend.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    /**
     * GET /api/books?search=...&categoryId=...&inStock=YES|NO
     * Доступен любому аутентифицированному пользователю (см. SecurityConfig: anyRequest → authenticated).
     */
    @GetMapping
    public ResponseEntity<List<BookResponse>> getBooks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String inStock
    ) {
        List<BookResponse> books = bookService.getBooks(search, categoryId, inStock);
        return ResponseEntity.ok(books);
    }

    /**
     * GET /api/books/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getBook(@PathVariable Long id) {
        BookResponse book = bookService.getBookById(id);
        return ResponseEntity.ok(book);
    }
}