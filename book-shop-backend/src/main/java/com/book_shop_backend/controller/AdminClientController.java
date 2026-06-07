package com.book_shop_backend.controller;

import com.book_shop_backend.dto.admin.client.AdminClientRequest;
import com.book_shop_backend.dto.admin.client.AdminClientResponse;
import com.book_shop_backend.service.AdminClientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/clients")
public class AdminClientController {

    private final AdminClientService service;

    public AdminClientController(
            AdminClientService service
    ) {
        this.service = service;
    }

    @GetMapping
    public List<AdminClientResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public AdminClientResponse getById(
            @PathVariable Long id
    ) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<AdminClientResponse>
    create(
            @Valid
            @RequestBody
            AdminClientRequest request
    ) {

        return ResponseEntity.ok(
                service.create(request)
        );
    }

    @PutMapping("/{id}")
    public AdminClientResponse update(
            @PathVariable Long id,
            @Valid
            @RequestBody
            AdminClientRequest request
    ) {

        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        service.delete(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}