package com.thillai.martialarts.repository;

import com.thillai.martialarts.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByStudentIdOrStudentIsNullOrderByCreatedAtDesc(Long studentId);

    @Modifying
    @Query("DELETE FROM Notification n WHERE n.student.id = :studentId")
    void deleteByStudentId(@Param("studentId") Long studentId);
}

