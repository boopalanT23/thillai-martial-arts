package com.thillai.martialarts.repository;

import com.thillai.martialarts.entity.StudentIdCard;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StudentIdCardRepository extends JpaRepository<StudentIdCard, Long> {
    Optional<StudentIdCard> findByStudentId(Long studentId);

    @Modifying
    @Query("DELETE FROM StudentIdCard s WHERE s.student.id = :studentId")
    void deleteByStudentId(@Param("studentId") Long studentId);
}

