package com.thillai.martialarts.service;

import com.thillai.martialarts.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Saves uploaded files (student photos, Aadhaar PDFs, gallery images,
 * trainer photos) to disk under app.upload.base-dir and returns a
 * public URL served by WebMvcConfig's static resource handler.
 *
 * For production at scale, swap the disk writes below for an S3 /
 * GCS / Azure Blob client — the public method signatures would stay
 * identical, so callers (services/controllers) need no changes.
 */
@Service
@RequiredArgsConstructor
public class FileStorageService {

    @Value("${app.upload.base-dir}")
    private String baseDir;

    @Value("${app.upload.public-url-prefix}")
    private String publicUrlPrefix;

    public String store(MultipartFile file, String subfolder) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file is empty");
        }
        try {
            Path dir;
            try {
                dir = Paths.get(baseDir, subfolder);
                Files.createDirectories(dir);
            } catch (Exception permEx) {
                Path fallbackBase = Paths.get(System.getProperty("java.io.tmpdir"), "uploads");
                dir = fallbackBase.resolve(subfolder);
                Files.createDirectories(dir);
            }

            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
            String extension = originalName.contains(".") ? originalName.substring(originalName.lastIndexOf('.')) : "";
            String filename = UUID.randomUUID() + extension;

            Path target = dir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            return publicUrlPrefix + "/" + subfolder + "/" + filename;
        } catch (IOException e) {
            throw new BadRequestException("Could not store file: " + e.getMessage());
        }
    }

    public void delete(String publicUrl) {
        if (publicUrl == null || !publicUrl.startsWith(publicUrlPrefix)) return;
        try {
            String relative = publicUrl.substring(publicUrlPrefix.length() + 1);
            Path target = Paths.get(baseDir, relative);
            Files.deleteIfExists(target);
        } catch (IOException ignored) {
            // Non-fatal — orphaned file on disk, safe to ignore
        }
    }
}
