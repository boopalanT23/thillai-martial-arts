package com.thillai.martialarts.controller;

import com.thillai.martialarts.dto.request.BatchRequest;
import com.thillai.martialarts.entity.Batch;
import com.thillai.martialarts.entity.Student;
import com.thillai.martialarts.service.BatchService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Batches", description = "Batch/timing catalogue (public read, admin write)")
public class BatchController {

    private final BatchService batchService;

    @GetMapping("/api/batches")
    public ResponseEntity<List<Batch>> getAll() {
        return ResponseEntity.ok(batchService.getAll());
    }

    @GetMapping("/api/batches/{id}")
    public ResponseEntity<Batch> getById(@PathVariable Long id) {
        return ResponseEntity.ok(batchService.getById(id));
    }

    @PostMapping("/api/admin/batches")
    public ResponseEntity<Batch> create(@RequestBody BatchRequest request) {
        return ResponseEntity.ok(batchService.create(request));
    }

    @PutMapping("/api/admin/batches/{id}")
    public ResponseEntity<Batch> update(@PathVariable Long id, @RequestBody BatchRequest request) {
        return ResponseEntity.ok(batchService.update(id, request));
    }

    @DeleteMapping("/api/admin/batches/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        batchService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/admin/batches/{id}/students")
    public ResponseEntity<List<Student>> getStudents(@PathVariable Long id) {
        return ResponseEntity.ok(batchService.getStudents(id));
    }
}
