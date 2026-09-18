package com.thillai.martialarts.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.thillai.martialarts.entity.Student;
import com.thillai.martialarts.entity.StudentIdCard;
import com.thillai.martialarts.repository.StudentIdCardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;

/**
 * Issues the QR-coded digital Student ID card. The QR payload encodes
 * just enough to verify identity at the front desk (ID + name + club)
 * without exposing sensitive data like mobile number or Aadhaar.
 *
 * Note: the printable card layout itself (photo, courses, batch, timing)
 * is rendered client-side in React (see IDCardGenerator.jsx) using
 * qrcode.react + html2canvas/jsPDF — this service is the source of
 * truth for the QR payload and keeps a server-side issuance record.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class IdCardService {

    private final StudentIdCardRepository studentIdCardRepository;

    public StudentIdCard issue(Student student) {
        String qrPayload = buildQrPayload(student);

        StudentIdCard card = studentIdCardRepository.findByStudentId(student.getId())
                .orElse(StudentIdCard.builder().student(student).build());

        card.setQrCodeData(qrPayload);
        card.setIssuedDate(LocalDate.now());

        return studentIdCardRepository.save(card);
    }

    public String buildQrPayload(Student student) {
        JSONObject payload = new JSONObject();
        payload.put("id", student.getStudentId());
        payload.put("name", student.getName());
        payload.put("club", "Thillai Martial Arts Club");
        return payload.toString();
    }

    /** Renders the QR payload as a PNG byte array — exposed in case a server-rendered card/PDF is needed later. */
    public byte[] generateQrPng(String payload, int size) {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix matrix = writer.encode(payload, BarcodeFormat.QR_CODE, size, size);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", out);
            return out.toByteArray();
        } catch (WriterException | IOException e) {
            log.error("QR generation failed", e);
            throw new RuntimeException("Could not generate QR code");
        }
    }
}
