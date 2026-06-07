package com.book_shop_backend.dto.admin.category;

import jakarta.validation.constraints.NotBlank;

public class AdminCategoryRequest {

    @NotBlank
    private String name;

    private String description;

    public AdminCategoryRequest() {
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}