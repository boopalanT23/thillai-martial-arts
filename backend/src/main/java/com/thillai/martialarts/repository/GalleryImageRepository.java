package com.thillai.martialarts.repository;

import com.thillai.martialarts.entity.GalleryImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GalleryImageRepository extends JpaRepository<GalleryImage, Long> {
    List<GalleryImage> findByCategoryOrderByUploadedAtDesc(String category);
    List<GalleryImage> findAllByOrderByUploadedAtDesc();
}
