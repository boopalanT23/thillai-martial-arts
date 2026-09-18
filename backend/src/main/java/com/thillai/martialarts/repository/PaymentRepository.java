package com.thillai.martialarts.repository;

import com.thillai.martialarts.entity.Payment;
import com.thillai.martialarts.entity.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    Optional<Payment> findByRazorpayOrderId(String orderId);
    List<Payment> findByStudentIdAndForMonthAndStatus(Long studentId, String forMonth, PaymentStatus status);
    List<Payment> findByStudentIdAndForMonth(Long studentId, String forMonth);
    List<Payment> findByStatusAndCreatedAtBetween(PaymentStatus status, LocalDateTime start, LocalDateTime end);
    Page<Payment> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Modifying
    @Query("DELETE FROM Payment p WHERE p.student.id = :studentId")
    void deleteByStudentId(@Param("studentId") Long studentId);
}

