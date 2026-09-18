package com.thillai.martialarts.repository;

import com.thillai.martialarts.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);

    @org.springframework.data.jpa.repository.Query("SELECT u.username FROM User u WHERE u.username LIKE 'TMA%'")
    java.util.List<String> findTmaUsernames();
}
