package com.thillai.martialarts.service;

import com.thillai.martialarts.dto.request.AttendanceMarkRequest;
import com.thillai.martialarts.entity.*;
import com.thillai.martialarts.exception.ResourceNotFoundException;
import com.thillai.martialarts.repository.AttendanceRepository;
import com.thillai.martialarts.repository.BatchRepository;
import com.thillai.martialarts.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final BatchRepository batchRepository;

    public Attendance mark(AttendanceMarkRequest request, String markedBy) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + request.getStudentId()));

        Batch batch = request.getBatchId() != null
                ? batchRepository.findById(request.getBatchId()).orElse(student.getBatch())
                : student.getBatch();

        LocalDate date = LocalDate.parse(request.getDate());

        Attendance attendance = attendanceRepository.findByStudentIdAndDate(student.getId(), date)
                .orElse(Attendance.builder().student(student).batch(batch).date(date).build());

        attendance.setStatus(AttendanceStatus.valueOf(request.getStatus().toUpperCase()));
        attendance.setMarkedBy(markedBy);

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getForStudent(Long studentId) {
        return attendanceRepository.findByStudentIdOrderByDateDesc(studentId);
    }

    public List<Attendance> getReport(Long batchId, String month) {
        YearMonth ym = month != null ? YearMonth.parse(month) : YearMonth.now();
        return attendanceRepository.findByBatchIdAndDate(batchId, ym.atDay(1)); // simplified single-day lookup;
        // extend with a date-range query for full-month reports as the dataset grows.
    }
}
