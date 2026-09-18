package com.thillai.martialarts.controller;

import com.thillai.martialarts.dto.response.RegistrationResponse;
import com.thillai.martialarts.dto.response.StudentResponse;
import com.thillai.martialarts.entity.Attendance;
import com.thillai.martialarts.service.AttendanceService;
import com.thillai.martialarts.service.ReportService;
import com.thillai.martialarts.service.StudentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Students", description = "Registration, profile, and admin student management")
public class StudentController {

    private final StudentService studentService;
    private final AttendanceService attendanceService;
    private final ReportService reportService;

    /** Public: registration, completed only after Razorpay payment succeeds client-side. */
    @PostMapping(value = "/students/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RegistrationResponse> register(
            @Valid @ModelAttribute com.thillai.martialarts.dto.request.StudentRegistrationRequest request,
            @RequestParam("photo") MultipartFile photo,
            @RequestParam(value = "aadhaarPdf", required = false) MultipartFile aadhaarPdf) {
        return ResponseEntity.ok(studentService.register(request, photo, aadhaarPdf));
    }

    /** Authenticated student: their own profile. */
    @GetMapping("/students/me")
    public ResponseEntity<StudentResponse> getMyProfile() {
        return ResponseEntity.ok(studentService.getCurrentStudentProfile());
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<StudentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getById(id));
    }

    /** Public: exact-match lookup by Student ID or mobile (used by Monthly Fees page). */
    @GetMapping("/students/search")
    public ResponseEntity<StudentResponse> search(@RequestParam("q") String query) {
        return ResponseEntity.ok(studentService.search(query));
    }

    @GetMapping("/students/{studentId}/id-card")
    public ResponseEntity<StudentResponse> getIdCard(@PathVariable String studentId) {
        return ResponseEntity.ok(studentService.search(studentId));
    }

    @GetMapping("/students/{studentId}/attendance")
    public ResponseEntity<List<Attendance>> getAttendance(@PathVariable String studentId) {
        StudentResponse resolved = studentService.search(studentId);
        return ResponseEntity.ok(attendanceService.getForStudent(resolved.getId()));
    }

    // ── Admin ────────────────────────────────────────────────────

    @GetMapping("/admin/students")
    public ResponseEntity<Page<StudentResponse>> getAll(
            @RequestParam(value = "q", required = false) String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(studentService.getAll(query, pageable));
    }

    @PutMapping("/admin/students/{id}")
    public ResponseEntity<StudentResponse> update(@PathVariable Long id, @RequestBody StudentResponse updates) {
        return ResponseEntity.ok(studentService.update(id, updates));
    }

    @DeleteMapping("/admin/students/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        studentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/admin/students/{id}/aadhaar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<StudentResponse> uploadAadhaar(
            @PathVariable Long id,
            @RequestParam("aadhaarPdf") MultipartFile aadhaarPdf) {
        return ResponseEntity.ok(studentService.updateAadhaar(id, aadhaarPdf));
    }

    @PutMapping("/admin/students/{id}/reset-password")
    public ResponseEntity<java.util.Map<String, String>> resetPassword(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> body) {
        String newPassword = body.get("newPassword");
        studentService.resetStudentPassword(id, newPassword);
        return ResponseEntity.ok(java.util.Map.of("message", "Password reset successfully"));
    }

    @GetMapping("/admin/students/export/excel")
    public ResponseEntity<byte[]> exportExcel() {
        byte[] data = reportService.generateStudentsExcel(studentService.findAllForExport());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=students.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(data);
    }
}
