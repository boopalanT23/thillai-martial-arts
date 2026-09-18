package com.thillai.martialarts.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Single-row table holding editable site-wide settings
 * (social links, club logo) managed from the Admin Panel.
 */
@Entity
@Table(name = "site_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    private String instagramUrl = "https://instagram.com/thillaimartialarts";

    private String facebookUrl;

    @Builder.Default
    private String youtubeUrl = "https://youtube.com/@thillaimartialarts";

    private String logoUrl;
}
