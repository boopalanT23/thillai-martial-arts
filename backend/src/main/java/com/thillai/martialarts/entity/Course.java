package com.thillai.martialarts.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String slug;

    @Column(nullable = false, length = 100)
    private String name;

    /** martial-arts | wellness | language | skill | creative */
    @Column(nullable = false, length = 40)
    private String category;

    @Column(nullable = false)
    private Integer feePerMonth;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "batch_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"courses", "hibernateLazyInitializer", "handler"})
    private Batch batch;

    @Column(length = 20)
    private String icon;

    @Column(length = 255)
    private String tagline;

    @Column(columnDefinition = "TEXT")
    private String overview;

    @Column(columnDefinition = "TEXT")
    private String benefits;

    @Column(columnDefinition = "TEXT")
    private String curriculum;

    @Column(length = 255)
    private String imageUrl;
}
