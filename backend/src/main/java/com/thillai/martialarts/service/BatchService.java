package com.thillai.martialarts.service;

import com.thillai.martialarts.dto.request.BatchRequest;
import com.thillai.martialarts.entity.Batch;
import com.thillai.martialarts.entity.Student;
import com.thillai.martialarts.exception.ResourceNotFoundException;
import com.thillai.martialarts.repository.BatchRepository;
import com.thillai.martialarts.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BatchService {

    private final BatchRepository batchRepository;
    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public List<Batch> getAll() {
        return batchRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Batch getById(Long id) {
        return batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found: " + id));
    }

    public Batch create(BatchRequest request) {
        Batch batch = Batch.builder()
                .name(request.getName())
                .days(request.getDays())
                .time(request.getTime())
                .description(request.getDescription())
                .build();
        return batchRepository.save(batch);
    }

    public Batch update(Long id, BatchRequest request) {
        Batch batch = getById(id);
        if (request.getName() != null) batch.setName(request.getName());
        if (request.getDays() != null) batch.setDays(request.getDays());
        if (request.getTime() != null) batch.setTime(request.getTime());
        if (request.getDescription() != null) batch.setDescription(request.getDescription());
        return batchRepository.save(batch);
    }

    public void delete(Long id) {
        if (!batchRepository.existsById(id)) {
            throw new ResourceNotFoundException("Batch not found: " + id);
        }
        batchRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Student> getStudents(Long batchId) {
        Batch batch = getById(batchId);
        return studentRepository.findAll().stream()
                .filter(s -> s.getBatch() != null && s.getBatch().getId().equals(batch.getId()))
                .toList();
    }
}
