package com.thillai.martialarts.controller;

import com.thillai.martialarts.dto.request.AttendanceMarkRequest;
import com.thillai.martialarts.entity.Attendance;
import com.thillai.martialarts.service.AttendanceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/attendance")
@RequiredArgsConstructor
@Tag(name = "Attendance", description = "Admin/trainer attendance marking and reports")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping
    public ResponseEntity<Attendance> mark(@RequestBody AttendanceMarkRequest request, Authentication authentication) {
        String markedBy = authentication != null ? authentication.getName() : "admin";
        return ResponseEntity.ok(attendanceService.mark(request, markedBy));
    }

    @GetMapping("/report")
    public ResponseEntity<List<Attendance>> getReport(
            @RequestParam Long batchId,
            @RequestParam(required = false) String month) {
        return ResponseEntity.ok(attendanceService.getReport(batchId, month));
    }
}
