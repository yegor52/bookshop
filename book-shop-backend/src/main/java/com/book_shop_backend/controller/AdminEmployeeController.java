package com.book_shop_backend.controller;

import com.book_shop_backend.dto.admin.employee.AdminEmployeeRegisterRequest;
import com.book_shop_backend.dto.admin.employee.AdminEmployeeRequest;
import com.book_shop_backend.dto.admin.employee.AdminEmployeeResponse;
import com.book_shop_backend.service.AdminEmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/employees")
public class AdminEmployeeController {

    private final AdminEmployeeService service;

    public AdminEmployeeController(AdminEmployeeService service) {
        this.service = service;
    }

    @GetMapping
    public List<AdminEmployeeResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public AdminEmployeeResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<AdminEmployeeResponse> create(
            @Valid @RequestBody AdminEmployeeRequest request
    ) {
        return ResponseEntity.ok(service.create(request));
    }

    @PutMapping("/{id}")
    public AdminEmployeeResponse update(
            @PathVariable Long id,
            @Valid @RequestBody AdminEmployeeRequest request
    ) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/register")
    public ResponseEntity<AdminEmployeeResponse> register(
            @Valid @RequestBody AdminEmployeeRegisterRequest request
    ) {
        return ResponseEntity.ok(service.register(request));
    }
}