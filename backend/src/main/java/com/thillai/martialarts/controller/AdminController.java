package com.thillai.martialarts.controller;

import com.thillai.martialarts.dto.request.SocialLinksRequest;
import com.thillai.martialarts.dto.response.DashboardStatsResponse;
import com.thillai.martialarts.entity.SiteSettings;
import com.thillai.martialarts.service.AdminDashboardService;
import com.thillai.martialarts.service.PaymentService;
import com.thillai.martialarts.service.ReportService;
import com.thillai.martialarts.service.SettingsService;
import com.thillai.martialarts.service.StudentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Dashboard analytics, revenue, exports and site settings")
public class AdminController {

    private final AdminDashboardService adminDashboardService;
    private final PaymentService paymentService;
    private final StudentService studentService;
    private final ReportService reportService;
    private final SettingsService settingsService;

    @GetMapping("/admin/dashboard")
    public ResponseEntity<DashboardStatsResponse> getDashboard() {
        return ResponseEntity.ok(adminDashboardService.getDashboard());
    }

    @GetMapping("/admin/payments/stats")
    public ResponseEntity<DashboardStatsResponse> getPaymentStats() {
        return ResponseEntity.ok(adminDashboardService.getDashboard());
    }

    @GetMapping("/admin/revenue/monthly")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyRevenue(
            @RequestParam(value = "year", required = false) Integer year) {
        int targetYear = year != null ? year : java.time.Year.now().getValue();
        return ResponseEntity.ok(adminDashboardService.getMonthlyRevenue(targetYear));
    }

    @GetMapping("/admin/students/export/pdf")
    public ResponseEntity<byte[]> exportStudentsPdf() {
        byte[] pdf = reportService.generateStudentsPdf(studentService.findAllForExport());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=students-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/admin/payments/export/pdf")
    public ResponseEntity<byte[]> exportPaymentsPdf() {
        byte[] pdf = paymentService.exportPaymentsPdf();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=payments-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @PostMapping(value = "/admin/settings/logo", consumes = "multipart/form-data")
    public ResponseEntity<SiteSettings> uploadLogo(@RequestParam("logo") MultipartFile logo) {
        return ResponseEntity.ok(settingsService.uploadLogo(logo));
    }

    @PutMapping("/admin/settings/social")
    public ResponseEntity<SiteSettings> updateSocialLinks(@RequestBody SocialLinksRequest request) {
        return ResponseEntity.ok(settingsService.updateSocialLinks(request));
    }

    @GetMapping("/settings/social")
    public ResponseEntity<SiteSettings> getSocialLinks() {
        return ResponseEntity.ok(settingsService.get());
    }
}
