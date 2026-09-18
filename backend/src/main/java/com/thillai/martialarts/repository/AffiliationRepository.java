package com.thillai.martialarts.repository;

import com.thillai.martialarts.entity.Affiliation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AffiliationRepository extends JpaRepository<Affiliation, Long> {
    List<Affiliation> findAllByOrderByDisplayOrderAsc();
}
