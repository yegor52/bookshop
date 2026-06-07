package com.book_shop_backend.dto.admin.category;

public class AdminCategoryResponse {

    private Long id;

    private String name;

    private String description;

    public AdminCategoryResponse() {
    }

    public AdminCategoryResponse(Long id,
                                 String name,
                                 String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}