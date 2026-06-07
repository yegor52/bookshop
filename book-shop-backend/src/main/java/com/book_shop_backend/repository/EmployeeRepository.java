package com.book_shop_backend.repository;

import com.book_shop_backend.entity.Employee;
import com.book_shop_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByUser(User user);

    Optional<Employee> findByUserId(Long userId);

    boolean existsByEmail(String email);
    Optional<Employee> findByUser_Id(Long userId);

    Optional<Employee> findByEmail(String email);

    Optional<Employee> findByUser_Login(String login);


}