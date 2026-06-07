package com.book_shop_backend.service;

import com.book_shop_backend.dto.admin.category.AdminCategoryRequest;
import com.book_shop_backend.dto.admin.category.AdminCategoryResponse;
import com.book_shop_backend.entity.Category;
import com.book_shop_backend.repository.BookRepository;
import com.book_shop_backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminCategoryService {

    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;

    public AdminCategoryService(
            CategoryRepository categoryRepository,
            BookRepository bookRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.bookRepository = bookRepository;
    }

    /**
     * Получить все категории.
     */
    public List<AdminCategoryResponse> getAllCategories() {

        return categoryRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Получить категорию по id.
     */
    public AdminCategoryResponse getCategoryById(Long id) {

        Category category = categoryRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found"
                        )
                );

        return mapToResponse(category);
    }

    /**
     * Создать категорию.
     */
    public AdminCategoryResponse createCategory(
            AdminCategoryRequest request
    ) {

        if (categoryRepository.existsByNameIgnoreCase(
                request.getName()
        )) {

            throw new RuntimeException(
                    "Category already exists"
            );
        }

        Category category = new Category();

        category.setName(request.getName());
        category.setDescription(
                request.getDescription()
        );

        Category saved =
                categoryRepository.save(category);

        return mapToResponse(saved);
    }

    /**
     * Обновить категорию.
     */
    public AdminCategoryResponse updateCategory(
            Long id,
            AdminCategoryRequest request
    ) {

        Category category = categoryRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found"
                        )
                );

        boolean exists =
                categoryRepository
                        .existsByNameIgnoreCase(
                                request.getName()
                        );

        if (exists &&
                !category.getName()
                        .equalsIgnoreCase(
                                request.getName()
                        )) {

            throw new RuntimeException(
                    "Category already exists"
            );
        }

        category.setName(request.getName());
        category.setDescription(
                request.getDescription()
        );

        Category updated =
                categoryRepository.save(category);

        return mapToResponse(updated);
    }

    /**
     * Удалить категорию.
     */
    public void deleteCategory(Long id) {

        Category category = categoryRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found"
                        )
                );

        boolean hasBooks =
                bookRepository.existsByCategory_Id(id);

        if (hasBooks) {

            throw new RuntimeException(
                    "Category cannot be deleted because books are linked to it"
            );
        }

        categoryRepository.delete(category);
    }

    private AdminCategoryResponse mapToResponse(
            Category category
    ) {

        return new AdminCategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription()
        );
    }
}