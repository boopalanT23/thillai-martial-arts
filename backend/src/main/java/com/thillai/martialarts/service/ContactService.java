package com.thillai.martialarts.service;

import com.thillai.martialarts.dto.request.ContactRequest;
import com.thillai.martialarts.entity.ContactMessage;
import com.thillai.martialarts.exception.ResourceNotFoundException;
import com.thillai.martialarts.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;
    private final EmailService emailService;

    public ContactMessage submit(ContactRequest request) {
        ContactMessage msg = ContactMessage.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .city(request.getCity())
                .state(request.getState())
                .message(request.getMessage())
                .isRead(false)
                .build();
        msg = contactMessageRepository.save(msg);

        emailService.sendContactNotificationToAdmin(msg);
        emailService.sendContactAcknowledgement(msg);

        return msg;
    }

    public Page<ContactMessage> getAll(Pageable pageable) {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public void markRead(Long id) {
        ContactMessage msg = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found: " + id));
        msg.setRead(true);
        contactMessageRepository.save(msg);
    }

    public void delete(Long id) {
        if (!contactMessageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Message not found: " + id);
        }
        contactMessageRepository.deleteById(id);
    }
}
