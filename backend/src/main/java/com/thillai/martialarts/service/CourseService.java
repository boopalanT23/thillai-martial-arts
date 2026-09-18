package com.thillai.martialarts.service;

import com.thillai.martialarts.dto.request.CourseRequest;
import com.thillai.martialarts.entity.Batch;
import com.thillai.martialarts.entity.Course;
import com.thillai.martialarts.exception.ResourceNotFoundException;
import com.thillai.martialarts.repository.BatchRepository;
import com.thillai.martialarts.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final BatchRepository batchRepository;

    @Transactional(readOnly = true)
    public List<Course> getAll() {
        return courseRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Course getBySlug(String slug) {
        return courseRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + slug));
    }

    public Course create(CourseRequest request) {
        Long batchId = request.getBatchId() != null ? request.getBatchId() : 1L;
        Batch batch = batchRepository.findById(batchId)
                .orElseGet(() -> batchRepository.findAll().stream().findFirst().orElse(null));

        String slug = request.getSlug();
        if (slug == null || slug.isBlank()) {
            slug = request.getName().toLowerCase().trim().replaceAll("[^a-z0-9]+", "-");
        }

        Course course = Course.builder()
                .slug(slug)
                .name(request.getName())
                .category(request.getCategory() != null ? request.getCategory() : "martial-arts")
                .feePerMonth(request.getFeePerMonth() != null ? request.getFeePerMonth() : 300)
                .batch(batch)
                .icon(request.getIcon() != null && !request.getIcon().isBlank() ? request.getIcon() : "🥋")
                .tagline(request.getTagline())
                .overview(request.getOverview())
                .benefits(request.getBenefits())
                .curriculum(request.getCurriculum())
                .imageUrl(request.getImageUrl())
                .build();
        return courseRepository.save(course);
    }

    public Course update(Long id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + id));

        if (request.getName() != null) course.setName(request.getName());
        if (request.getCategory() != null) course.setCategory(request.getCategory());
        if (request.getFeePerMonth() != null) course.setFeePerMonth(request.getFeePerMonth());
        if (request.getIcon() != null) course.setIcon(request.getIcon());
        if (request.getTagline() != null) course.setTagline(request.getTagline());
        if (request.getOverview() != null) course.setOverview(request.getOverview());
        if (request.getBenefits() != null) course.setBenefits(request.getBenefits());
        if (request.getCurriculum() != null) course.setCurriculum(request.getCurriculum());
        if (request.getImageUrl() != null) course.setImageUrl(request.getImageUrl());
        if (request.getBatchId() != null) {
            Batch batch = batchRepository.findById(request.getBatchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Batch not found: " + request.getBatchId()));
            course.setBatch(batch);
        }
        return courseRepository.save(course);
    }

    public void delete(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found: " + id);
        }
        courseRepository.deleteById(id);
    }
}
