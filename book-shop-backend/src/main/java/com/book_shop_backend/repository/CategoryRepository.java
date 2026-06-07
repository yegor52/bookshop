package com.book_shop_backend.repository;

import com.book_shop_backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByName(String name);
    boolean existsByNameIgnoreCase(String name);

}