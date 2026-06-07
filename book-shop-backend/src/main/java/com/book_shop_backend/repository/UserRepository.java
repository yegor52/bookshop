package com.book_shop_backend.repository;

import com.book_shop_backend.entity.User;
import com.book_shop_backend.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByLogin(String login);

    boolean existsByLogin(String login);

    Optional<User> findById(Long id);

    Optional<User> findByIdAndStatus(Long id, UserStatus status);

}