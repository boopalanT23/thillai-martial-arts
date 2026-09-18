package com.thillai.martialarts.controller;

import com.thillai.martialarts.dto.request.NotificationSendRequest;
import com.thillai.martialarts.dto.response.StudentResponse;
import com.thillai.martialarts.entity.Notification;
import com.thillai.martialarts.service.NotificationService;
import com.thillai.martialarts.service.StudentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Student notifications — broadcast or targeted")
public class NotificationController {

    private final NotificationService notificationService;
    private final StudentService studentService;

    /** {studentId} is the public Student ID (e.g. TMA0001) or mobile number, as sent by the SPA. */
    @GetMapping("/api/notifications/{studentId}")
    public ResponseEntity<List<Notification>> getForStudent(@PathVariable String studentId) {
        StudentResponse resolved = studentService.search(studentId);
        return ResponseEntity.ok(notificationService.getForStudent(resolved.getId()));
    }

    @PatchMapping("/api/notifications/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable Long id) {
        notificationService.markRead(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/admin/notifications")
    public ResponseEntity<Notification> send(@RequestBody NotificationSendRequest request) {
        return ResponseEntity.ok(notificationService.send(request));
    }
}
