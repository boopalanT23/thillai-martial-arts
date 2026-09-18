package com.thillai.martialarts.controller;

import com.thillai.martialarts.dto.request.PaymentOrderRequest;
import com.thillai.martialarts.dto.request.PaymentVerifyRequest;
import com.thillai.martialarts.dto.response.DueResponse;
import com.thillai.martialarts.dto.response.PaymentHistoryResponse;
import com.thillai.martialarts.service.PaymentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Razorpay order creation, verification, dues and invoices")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/payments/create-order")
    public ResponseEntity<String> createOrder(@Valid @RequestBody PaymentOrderRequest request) {
        JSONObject order = paymentService.createOrder(request);
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(order.toString());
    }

    @PostMapping("/payments/verify")
    public ResponseEntity<PaymentHistoryResponse> verify(@Valid @RequestBody PaymentVerifyRequest request) {
        return ResponseEntity.ok(paymentService.verifyAndRecordMonthlyPayment(request));
    }

    @GetMapping("/payments/history/{studentId}")
    public ResponseEntity<List<PaymentHistoryResponse>> getHistory(@PathVariable String studentId) {
        return ResponseEntity.ok(paymentService.getHistory(studentId));
    }

    @GetMapping("/payments/due/{studentId}")
    public ResponseEntity<DueResponse> getDue(@PathVariable String studentId) {
        return ResponseEntity.ok(paymentService.getDue(studentId));
    }

    @GetMapping("/payments/{paymentId}/invoice")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long paymentId) {
        byte[] pdf = paymentService.downloadInvoice(paymentId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice-" + paymentId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    // ── Admin ────────────────────────────────────────────────────

    @GetMapping("/admin/payments")
    public ResponseEntity<Page<PaymentHistoryResponse>> getAll(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(paymentService.getAll(pageable));
    }
}
