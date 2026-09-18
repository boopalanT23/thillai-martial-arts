package com.thillai.martialarts.repository;

import com.thillai.martialarts.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByStudentId(Long studentId);

    @Modifying
    @Query("DELETE FROM Registration r WHERE r.student.id = :studentId")
    void deleteByStudentId(@Param("studentId") Long studentId);
}

