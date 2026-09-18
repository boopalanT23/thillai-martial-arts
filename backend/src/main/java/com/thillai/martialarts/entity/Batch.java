package com.thillai.martialarts.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "batches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Batch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 150)
    private String name;

    /** e.g. "Monday, Wednesday, Friday" */
    @Column(nullable = false, length = 100)
    private String days;

    /** e.g. "Morning / Evening (According to school presence)" */
    @Column(nullable = false, length = 150)
    private String time;

    @Column(length = 500)
    private String description;

    @OneToMany(mappedBy = "batch")
    @com.fasterxml.jackson.annotation.JsonIgnore
    @Builder.Default
    private List<Course> courses = new ArrayList<>();
}
