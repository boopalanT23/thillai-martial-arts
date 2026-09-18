package com.thillai.martialarts.controller;

import com.thillai.martialarts.dto.request.ContactRequest;
import com.thillai.martialarts.dto.response.MessageResponse;
import com.thillai.martialarts.entity.ContactMessage;
import com.thillai.martialarts.service.ContactService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Contact", description = "Public contact form + admin inbox")
public class ContactController {

    private final ContactService contactService;

    @PostMapping("/api/contact")
    public ResponseEntity<MessageResponse> submit(@Valid @RequestBody ContactRequest request) {
        contactService.submit(request);
        return ResponseEntity.ok(MessageResponse.of(
                "Thank you! Your message has been received. We'll get back to you shortly."));
    }

    @GetMapping("/api/admin/contacts")
    public ResponseEntity<Page<ContactMessage>> getAll(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(contactService.getAll(pageable));
    }

    @PatchMapping("/api/admin/contacts/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable Long id) {
        contactService.markRead(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/api/admin/contacts/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        contactService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
