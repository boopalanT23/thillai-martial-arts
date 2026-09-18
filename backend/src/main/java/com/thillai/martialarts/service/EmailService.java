package com.thillai.martialarts.service;

import com.thillai.martialarts.entity.ContactMessage;
import com.thillai.martialarts.entity.Payment;
import com.thillai.martialarts.entity.Student;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromAddress;

    @Value("${app.mail.club-name}")
    private String clubName;

    /** Sent to the club's inbox whenever the public Contact form is used. */
    @Async
    public void sendContactNotificationToAdmin(ContactMessage msg) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(fromAddress);
        mail.setTo(fromAddress);
        mail.setSubject("New Contact Form Submission — " + msg.getName());
        mail.setText("""
                New message received via the website contact form:

                Name: %s
                Phone: %s
                Email: %s
                City: %s
                State: %s

                Message:
                %s
                """.formatted(msg.getName(), msg.getPhone(), msg.getEmail(), msg.getCity(), msg.getState(), msg.getMessage()));
        safeSend(mail);
    }

    /** Auto-acknowledgement sent back to the person who submitted the contact form. */
    @Async
    public void sendContactAcknowledgement(ContactMessage msg) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(fromAddress);
        mail.setTo(msg.getEmail());
        mail.setSubject("Thank you for contacting " + clubName);
        mail.setText("""
                Dear %s,

                Thank you for reaching out to %s. We have received your message and
                our team will get back to you within 24 hours.

                If your enquiry is urgent, please call us directly at +91 80720 89377.

                Warm regards,
                %s
                """.formatted(msg.getName(), clubName, clubName));
        safeSend(mail);
    }

    @Async
    public void sendRegistrationConfirmation(Student student) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(fromAddress);
        mail.setTo(fromAddress); // student email isn't collected at registration — internal copy
        mail.setSubject("New Student Registered — " + student.getStudentId());
        mail.setText("""
                A new student has completed registration and payment:

                Student ID: %s
                Name: %s
                Mobile: %s
                Batch: %s

                Welcome them to %s!
                """.formatted(student.getStudentId(), student.getName(), student.getMobile(),
                student.getBatch() != null ? student.getBatch().getName() : "—", clubName));
        safeSend(mail);
    }

    @Async
    public void sendPaymentReceipt(Student student, Payment payment) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(fromAddress);
        mail.setTo(fromAddress); // forward internally; wire to student email once collected
        mail.setSubject("Payment Receipt — " + payment.getInvoiceNumber());
        mail.setText("""
                Payment received successfully.

                Student: %s (%s)
                Invoice No: %s
                Amount: ₹%d
                Type: %s
                Date: %s

                Thank you for staying current with your fees at %s.
                """.formatted(student.getName(), student.getStudentId(), payment.getInvoiceNumber(),
                payment.getAmount(), payment.getType(), payment.getPaidAt(), clubName));
        safeSend(mail);
    }

    private void safeSend(SimpleMailMessage mail) {
        try {
            mailSender.send(mail);
        } catch (Exception e) {
            // Email is a non-critical side effect — never let SMTP failures break the request flow.
            log.warn("Could not send email ({}): {}", mail.getSubject(), e.getMessage());
        }
    }
}
