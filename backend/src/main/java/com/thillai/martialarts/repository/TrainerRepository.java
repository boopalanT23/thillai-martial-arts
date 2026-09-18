package com.thillai.martialarts.repository;

import com.thillai.martialarts.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT t FROM Trainer t LEFT JOIN FETCH t.qualifications ORDER BY t.displayOrder ASC")
    List<Trainer> findAllByOrderByDisplayOrderAsc();
}
