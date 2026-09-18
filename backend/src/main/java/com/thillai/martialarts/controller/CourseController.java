package com.thillai.martialarts.controller;

import com.thillai.martialarts.dto.request.CourseRequest;
import com.thillai.martialarts.entity.Course;
import com.thillai.martialarts.service.CourseService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Courses", description = "Course catalogue (public read, admin write)")
public class CourseController {

    private final CourseService courseService;

    @GetMapping("/api/courses")
    public ResponseEntity<List<Course>> getAll() {
        return ResponseEntity.ok(courseService.getAll());
    }

    @GetMapping("/api/courses/{slug}")
    public ResponseEntity<Course> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(courseService.getBySlug(slug));
    }

    @PostMapping("/api/admin/courses")
    public ResponseEntity<Course> create(@RequestBody CourseRequest request) {
        return ResponseEntity.ok(courseService.create(request));
    }

    @PutMapping("/api/admin/courses/{id}")
    public ResponseEntity<Course> update(@PathVariable Long id, @RequestBody CourseRequest request) {
        return ResponseEntity.ok(courseService.update(id, request));
    }

    @DeleteMapping("/api/admin/courses/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        courseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
