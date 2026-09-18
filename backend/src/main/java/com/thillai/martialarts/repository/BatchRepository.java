package com.thillai.martialarts.repository;

import com.thillai.martialarts.entity.Batch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BatchRepository extends JpaRepository<Batch, Long> {
    Optional<Batch> findByName(String name);
}
