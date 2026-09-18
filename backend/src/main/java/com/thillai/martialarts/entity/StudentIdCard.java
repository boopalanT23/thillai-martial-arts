package com.thillai.martialarts.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "student_id_cards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentIdCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private Student student;

    @Column(length = 500)
    private String qrCodeData;

    @Column(length = 255)
    private String pdfUrl;

    private LocalDate issuedDate;
}
