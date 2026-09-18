package com.thillai.martialarts.repository;

import com.thillai.martialarts.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    // Optional<Student> findByStudentId(String studentId);
    // Optional<Student> findByMobile(String mobile);

    @Query("""
SELECT s
FROM Student s
LEFT JOIN FETCH s.user
WHERE s.studentId = :studentId
""")
Optional<Student> findByStudentId(@Param("studentId") String studentId);

@Query("""
SELECT s
FROM Student s
LEFT JOIN FETCH s.user
WHERE s.mobile = :mobile
""")
Optional<Student> findByMobile(@Param("mobile") String mobile);

    @Query("""
    SELECT s
    FROM Student s
    LEFT JOIN FETCH s.user
    LEFT JOIN FETCH s.batch
    LEFT JOIN FETCH s.courses
    WHERE s.user = :user
    """)
    Optional<Student> findByUser(@Param("user") com.thillai.martialarts.entity.User user);

    @Query("""
    SELECT s
    FROM Student s
    LEFT JOIN FETCH s.user
    LEFT JOIN FETCH s.batch
    LEFT JOIN FETCH s.courses
    WHERE s.user.id = :userId
    """)
    Optional<Student> findByUserId(@Param("userId") Long userId);

    boolean existsByMobile(String mobile);

    boolean existsByStudentId(String studentId);

    @Query("SELECT s.studentId FROM Student s WHERE s.studentId IS NOT NULL")
    java.util.List<String> findAllStudentIds();

    @Query("SELECT s FROM Student s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(s.studentId) LIKE LOWER(CONCAT('%', :q, '%')) OR s.mobile LIKE CONCAT('%', :q, '%')")
    Page<Student> search(@Param("q") String query, Pageable pageable);

    @Query("SELECT DISTINCT s FROM Student s LEFT JOIN FETCH s.batch LEFT JOIN FETCH s.courses LEFT JOIN FETCH s.user")
    java.util.List<Student> findAllWithDetails();

    long countByCreatedAtBefore(java.time.LocalDateTime cutoff);

    @Modifying
    @Query(value = "DELETE FROM student_courses WHERE student_id = :studentId", nativeQuery = true)
    void deleteStudentCourses(@Param("studentId") Long studentId);
}

