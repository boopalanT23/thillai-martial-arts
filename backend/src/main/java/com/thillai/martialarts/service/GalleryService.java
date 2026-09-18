package com.thillai.martialarts.service;

import com.thillai.martialarts.entity.GalleryImage;
import com.thillai.martialarts.exception.ResourceNotFoundException;
import com.thillai.martialarts.repository.GalleryImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GalleryService {

    private final GalleryImageRepository galleryImageRepository;
    private final FileStorageService fileStorageService;

    public List<GalleryImage> getAll(String category) {
        if (category == null || category.isBlank() || category.equalsIgnoreCase("all")) {
            return galleryImageRepository.findAllByOrderByUploadedAtDesc();
        }
        return galleryImageRepository.findByCategoryOrderByUploadedAtDesc(category);
    }

    public List<String> getCategories() {
        return List.of("competitions", "training", "championships", "events", "yoga", "fitness", "celebrations");
    }

    public GalleryImage upload(MultipartFile image, String title, String category) {
        return uploadMedia(image, null, title, category, null, null);
    }

    public GalleryImage uploadMedia(MultipartFile file, MultipartFile thumbnail, String title, String category, String mediaType, String videoUrl) {
        String determinedMediaType = "IMAGE";
        String finalImageUrl = "";
        String finalVideoUrl = null;

        boolean hasVideoUrl = videoUrl != null && !videoUrl.isBlank();
        boolean isVideoFile = false;

        if (file != null && !file.isEmpty()) {
            String contentType = file.getContentType();
            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
            if ((contentType != null && contentType.startsWith("video/")) ||
                    originalName.endsWith(".mp4") || originalName.endsWith(".webm") ||
                    originalName.endsWith(".mov") || originalName.endsWith(".ogg") ||
                    originalName.endsWith(".mkv") || originalName.endsWith(".avi")) {
                isVideoFile = true;
            }
        }

        if ("VIDEO".equalsIgnoreCase(mediaType) || hasVideoUrl || isVideoFile) {
            determinedMediaType = "VIDEO";
        }

        // 1. If external video URL provided
        if (hasVideoUrl) {
            finalVideoUrl = videoUrl.trim();
            finalImageUrl = extractThumbnailFromVideoUrl(finalVideoUrl);

            // If thumbnail file also provided, use that instead
            if (thumbnail != null && !thumbnail.isEmpty()) {
                finalImageUrl = fileStorageService.store(thumbnail, "gallery");
            }
        }
        // 2. If video file uploaded
        else if (isVideoFile && file != null && !file.isEmpty()) {
            finalVideoUrl = fileStorageService.store(file, "gallery");
            if (thumbnail != null && !thumbnail.isEmpty()) {
                finalImageUrl = fileStorageService.store(thumbnail, "gallery");
            } else {
                finalImageUrl = finalVideoUrl;
            }
        }
        // 3. Image file uploaded (or default fallback)
        else if (file != null && !file.isEmpty()) {
            finalImageUrl = fileStorageService.store(file, "gallery");
            determinedMediaType = "IMAGE";
        }

        String safeTitle = (title != null && !title.isBlank()) ? title.trim() : (category != null ? category : "Gallery Media");

        GalleryImage galleryImage = GalleryImage.builder()
                .title(safeTitle)
                .category(category != null ? category : "training")
                .imageUrl(finalImageUrl)
                .mediaType(determinedMediaType)
                .videoUrl(finalVideoUrl)
                .build();

        return galleryImageRepository.save(galleryImage);
    }

    private String extractThumbnailFromVideoUrl(String url) {
        if (url == null || url.isBlank()) return "";

        // YouTube ID extraction
        java.util.regex.Pattern ytPattern = java.util.regex.Pattern.compile(
                "(?:youtu\\.be/|youtube\\.com/(?:embed/|v/|watch\\?v=|watch\\?.+&v=|shorts/))([\\w-]{11})",
                java.util.regex.Pattern.CASE_INSENSITIVE
        );
        java.util.regex.Matcher matcher = ytPattern.matcher(url);
        if (matcher.find()) {
            String videoId = matcher.group(1);
            return "https://img.youtube.com/vi/" + videoId + "/hqdefault.jpg";
        }

        // Return URL directly as fallback
        return url;
    }

    public void delete(Long id) {
        GalleryImage image = galleryImageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found: " + id));

        if (image.getImageUrl() != null && !image.getImageUrl().startsWith("http://") && !image.getImageUrl().startsWith("https://")) {
            fileStorageService.delete(image.getImageUrl());
        }
        if (image.getVideoUrl() != null && !image.getVideoUrl().startsWith("http://") && !image.getVideoUrl().startsWith("https://")) {
            fileStorageService.delete(image.getVideoUrl());
        }

        galleryImageRepository.delete(image);
    }
}
