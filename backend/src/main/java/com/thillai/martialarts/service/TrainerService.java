package com.thillai.martialarts.service;

import com.thillai.martialarts.entity.Trainer;
import com.thillai.martialarts.exception.ResourceNotFoundException;
import com.thillai.martialarts.repository.TrainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainerService {

    private final TrainerRepository trainerRepository;
    private final FileStorageService fileStorageService;

    public List<Trainer> getAll() {
        return trainerRepository.findAllByOrderByDisplayOrderAsc();
    }

    public Trainer create(String name, String designation, List<String> qualifications, MultipartFile image) {
        String imageUrl = (image != null && !image.isEmpty()) ? fileStorageService.store(image, "trainers") : null;
        Trainer trainer = Trainer.builder()
                .name(name)
                .designation(designation)
                .qualifications(qualifications != null ? qualifications : List.of())
                .imageUrl(imageUrl)
                .displayOrder((int) trainerRepository.count() + 1)
                .build();
        return trainerRepository.save(trainer);
    }

    public Trainer update(Long id, String name, String designation, List<String> qualifications, MultipartFile image) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found: " + id));
        if (name != null) trainer.setName(name);
        if (designation != null) trainer.setDesignation(designation);
        if (qualifications != null) trainer.setQualifications(qualifications);
        if (image != null && !image.isEmpty()) {
            fileStorageService.delete(trainer.getImageUrl());
            trainer.setImageUrl(fileStorageService.store(image, "trainers"));
        }
        return trainerRepository.save(trainer);
    }

    public void delete(Long id) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found: " + id));
        fileStorageService.delete(trainer.getImageUrl());
        trainerRepository.delete(trainer);
    }
}
