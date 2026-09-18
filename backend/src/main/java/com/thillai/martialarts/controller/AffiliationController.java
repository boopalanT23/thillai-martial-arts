package com.thillai.martialarts.controller;

import com.thillai.martialarts.entity.Affiliation;
import com.thillai.martialarts.service.AffiliationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Affiliations", description = "Affiliated organisation logos — public read, admin write")
public class AffiliationController {

    private final AffiliationService affiliationService;

    @GetMapping("/api/affiliations")
    public ResponseEntity<List<Affiliation>> getAll() {
        return ResponseEntity.ok(affiliationService.getAll());
    }

    @PutMapping(value = "/api/admin/affiliations/{id}", consumes = "multipart/form-data")
    public ResponseEntity<Affiliation> update(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "logo", required = false) MultipartFile logo) {
        return ResponseEntity.ok(affiliationService.update(id, name, logo));
    }
}
