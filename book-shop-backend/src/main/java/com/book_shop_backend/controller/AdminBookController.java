package com.book_shop_backend.controller;

import com.book_shop_backend.dto.admin.book.AdminBookRequest;
import com.book_shop_backend.dto.admin.book.AdminBookResponse;
import com.book_shop_backend.service.AdminBookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/books")
public class AdminBookController {

    private final AdminBookService adminBookService;

    public AdminBookController(
            AdminBookService adminBookService
    ) {
        this.adminBookService = adminBookService;
    }

    /**
     * Получить все книги.
     */
    @GetMapping
    public ResponseEntity<List<AdminBookResponse>>
    getAllBooks() {

        return ResponseEntity.ok(
                adminBookService.getAllBooks()
        );
    }

    /**
     * Получить книгу по id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AdminBookResponse>
    getBookById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                adminBookService.getBookById(id)
        );
    }

    /**
     * Создать книгу.
     */
    @PostMapping
    public ResponseEntity<AdminBookResponse>
    createBook(
            @Valid @RequestBody
            AdminBookRequest request
    ) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        adminBookService.createBook(request)
                );
    }

    /**
     * Обновить книгу.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AdminBookResponse>
    updateBook(
            @PathVariable Long id,
            @Valid @RequestBody
            AdminBookRequest request
    ) {

        return ResponseEntity.ok(
                adminBookService.updateBook(
                        id,
                        request
                )
        );
    }

    /**
     * Удалить книгу.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteBook(
            @PathVariable Long id
    ) {

        adminBookService.deleteBook(id);

        return ResponseEntity.noContent().build();
    }
}