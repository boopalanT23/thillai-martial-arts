package com.thillai.martialarts.controller;

import com.thillai.martialarts.entity.Trainer;
import com.thillai.martialarts.service.TrainerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Trainers", description = "Trainer profiles — public read, admin write")
public class TrainerController {

    private final TrainerService trainerService;

    @GetMapping("/api/trainers")
    public ResponseEntity<List<Trainer>> getAll() {
        return ResponseEntity.ok(trainerService.getAll());
    }

    @PostMapping(value = "/api/admin/trainers", consumes = "multipart/form-data")
    public ResponseEntity<Trainer> create(
            @RequestParam("name") String name,
            @RequestParam("designation") String designation,
            @RequestParam(value = "qualifications", required = false) List<String> qualifications,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(trainerService.create(name, designation, qualifications, image));
    }

    @PutMapping(value = "/api/admin/trainers/{id}", consumes = "multipart/form-data")
    public ResponseEntity<Trainer> update(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "designation", required = false) String designation,
            @RequestParam(value = "qualifications", required = false) List<String> qualifications,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(trainerService.update(id, name, designation, qualifications, image));
    }

    @DeleteMapping("/api/admin/trainers/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        trainerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
