package com.thillai.martialarts.service;

import com.thillai.martialarts.entity.Affiliation;
import com.thillai.martialarts.exception.ResourceNotFoundException;
import com.thillai.martialarts.repository.AffiliationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AffiliationService {

    private final AffiliationRepository affiliationRepository;
    private final FileStorageService fileStorageService;

    public List<Affiliation> getAll() {
        return affiliationRepository.findAllByOrderByDisplayOrderAsc();
    }

    public Affiliation update(Long id, String name, MultipartFile logo) {
        Affiliation affiliation = affiliationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Affiliation not found: " + id));
        if (name != null && !name.isBlank()) affiliation.setName(name);
        if (logo != null && !logo.isEmpty()) {
            fileStorageService.delete(affiliation.getLogoUrl());
            affiliation.setLogoUrl(fileStorageService.store(logo, "affiliations"));
        }
        return affiliationRepository.save(affiliation);
    }
}
