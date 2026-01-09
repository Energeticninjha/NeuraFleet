package com.example.neurafleet_backend.repository;
import java.util.Optional;

import com.example.neurafleet_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // No code needed here! 
    // JpaRepository provides all MySQL methods (save, find, delete) automatically.
Optional<User> findByUsername(String username);
}