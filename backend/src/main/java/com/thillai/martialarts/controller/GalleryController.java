package com.thillai.martialarts.controller;

import com.thillai.martialarts.entity.GalleryImage;
import com.thillai.martialarts.service.GalleryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Gallery", description = "Photo gallery — public read, admin upload/delete")
public class GalleryController {

    private final GalleryService galleryService;

    @GetMapping("/api/gallery")
    public ResponseEntity<List<GalleryImage>> getAll(@RequestParam(value = "category", required = false) String category) {
        return ResponseEntity.ok(galleryService.getAll(category));
    }

    @GetMapping("/api/gallery/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(galleryService.getCategories());
    }

    @PostMapping(value = "/api/admin/gallery", consumes = "multipart/form-data")
    public ResponseEntity<GalleryImage> upload(
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "video", required = false) MultipartFile video,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam("category") String category,
            @RequestParam(value = "mediaType", required = false) String mediaType,
            @RequestParam(value = "videoUrl", required = false) String videoUrl) {
        MultipartFile mediaFile = (image != null && !image.isEmpty()) ? image : ((video != null && !video.isEmpty()) ? video : file);
        return ResponseEntity.ok(galleryService.uploadMedia(mediaFile, thumbnail, title, category, mediaType, videoUrl));
    }

    @DeleteMapping("/api/admin/gallery/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        galleryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
