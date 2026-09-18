package com.thillai.martialarts.service;

import com.thillai.martialarts.dto.request.NotificationSendRequest;
import com.thillai.martialarts.entity.Notification;
import com.thillai.martialarts.entity.Student;
import com.thillai.martialarts.exception.ResourceNotFoundException;
import com.thillai.martialarts.repository.NotificationRepository;
import com.thillai.martialarts.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final StudentRepository studentRepository;

    public List<Notification> getForStudent(Long studentId) {
        return notificationRepository.findByStudentIdOrStudentIsNullOrderByCreatedAtDesc(studentId);
    }

    public void markRead(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + id));
        n.setRead(true);
        notificationRepository.save(n);
    }

    public Notification send(NotificationSendRequest request) {
        Student student = null;
        if (request.getStudentId() != null && !request.getStudentId().isBlank()) {
            student = studentRepository.findByStudentId(request.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + request.getStudentId()));
        }
        Notification notification = Notification.builder()
                .student(student)
                .title(request.getTitle())
                .message(request.getMessage())
                .isRead(false)
                .build();
        return notificationRepository.save(notification);
    }
}
