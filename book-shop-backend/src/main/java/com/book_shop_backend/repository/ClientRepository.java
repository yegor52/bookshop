package com.book_shop_backend.repository;

import com.book_shop_backend.entity.Client;
import com.book_shop_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {

    Optional<Client> findByUser(User user);

    Optional<Client> findByUserId(Long userId);

    boolean existsByEmail(String email);

    Optional<Client> findByEmail(String email);

    Optional<Client> findByUser_Login(String login);

}