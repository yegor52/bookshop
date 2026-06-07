package com.book_shop_backend.controller;

import com.book_shop_backend.dto.admin.category.AdminCategoryRequest;
import com.book_shop_backend.dto.admin.category.AdminCategoryResponse;
import com.book_shop_backend.service.AdminCategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
public class AdminCategoryController {

    private final AdminCategoryService
            adminCategoryService;

    public AdminCategoryController(
            AdminCategoryService adminCategoryService
    ) {
        this.adminCategoryService =
                adminCategoryService;
    }

    /**
     * Получить все категории.
     */
    @GetMapping
    public ResponseEntity<List<AdminCategoryResponse>>
    getAllCategories() {

        return ResponseEntity.ok(
                adminCategoryService.getAllCategories()
        );
    }

    /**
     * Получить категорию по id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AdminCategoryResponse>
    getCategoryById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                adminCategoryService
                        .getCategoryById(id)
        );
    }

    /**
     * Создать категорию.
     */
    @PostMapping
    public ResponseEntity<AdminCategoryResponse>
    createCategory(
            @Valid @RequestBody
            AdminCategoryRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        adminCategoryService
                                .createCategory(request)
                );
    }

    /**
     * Обновить категорию.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AdminCategoryResponse>
    updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody
            AdminCategoryRequest request
    ) {

        return ResponseEntity.ok(
                adminCategoryService.updateCategory(
                        id,
                        request
                )
        );
    }

    /**
     * Удалить категорию.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteCategory(
            @PathVariable Long id
    ) {

        adminCategoryService.deleteCategory(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}