package com.thillai.martialarts.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "affiliations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Affiliation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 255)
    private String logoUrl;

    @Column(nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;
}
