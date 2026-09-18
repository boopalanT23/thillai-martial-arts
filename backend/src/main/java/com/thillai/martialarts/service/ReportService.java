package com.thillai.martialarts.service;

// ── iText (PDF) — explicit imports to avoid Font ambiguity with Apache POI ──
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Image;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

// ── Apache POI (Excel) — explicit imports ────────────────────────────────────
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.thillai.martialarts.entity.Payment;
import com.thillai.martialarts.entity.Student;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;

/**
 * Generates downloadable Excel (.xlsx) and PDF reports for the Admin
 * Panel — student rosters, payment ledgers, and individual invoices.
 */
@Service
@Slf4j
@org.springframework.transaction.annotation.Transactional(readOnly = true)
public class ReportService {

    private static final BaseColor GOLD = new BaseColor(0xC9, 0xA2, 0x27);
    private static final BaseColor DARK = new BaseColor(0x0A, 0x0A, 0x0A);

    // ── Excel ────────────────────────────────────────────────────

    public byte[] generateStudentsExcel(List<Student> students) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Students");

            CellStyle headerStyle = workbook.createCellStyle();
            // Fully-qualified POI Font — avoids ambiguity with com.itextpdf.text.Font
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            String[] headers = {"Student ID", "Name", "Mobile", "DOB", "Joining Date", "Batch", "Courses", "Monthly Fee"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (Student s : students) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(s.getStudentId());
                row.createCell(1).setCellValue(s.getName());
                row.createCell(2).setCellValue(s.getMobile());
                row.createCell(3).setCellValue(s.getDob() != null ? s.getDob().toString() : "");
                row.createCell(4).setCellValue(s.getJoiningDate() != null ? s.getJoiningDate().toString() : "");
                row.createCell(5).setCellValue(s.getBatch() != null ? s.getBatch().getName() : "");
                row.createCell(6).setCellValue(String.join(", ", s.getCourses().stream().map(c -> c.getName()).toList()));
                row.createCell(7).setCellValue(s.getMonthlyFee());
            }

            for (int i = 0; i < headers.length; i++) sheet.autoSizeColumn(i);

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            log.error("Excel export failed", e);
            throw new RuntimeException("Could not generate Excel report");
        }
    }

    // ── PDF: Students roster ────────────────────────────────────

    public byte[] generateStudentsPdf(List<Student> students) {
        return buildPdf("Student Roster", document -> {
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            addHeaderCells(table, "Student ID", "Name", "Mobile", "Batch", "Courses", "Fee/Month");

            Font cellFont = new Font(Font.FontFamily.HELVETICA, 9);
            for (Student s : students) {
                table.addCell(new Phrase(s.getStudentId(), cellFont));
                table.addCell(new Phrase(s.getName(), cellFont));
                table.addCell(new Phrase(s.getMobile(), cellFont));
                table.addCell(new Phrase(s.getBatch() != null ? s.getBatch().getName() : "-", cellFont));
                table.addCell(new Phrase(String.join(", ", s.getCourses().stream().map(c -> c.getName()).toList()), cellFont));
                table.addCell(new Phrase("Rs." + s.getMonthlyFee(), cellFont));
            }
            document.add(table);
        });
    }

    // ── PDF: Payments ledger ────────────────────────────────────

    public byte[] generatePaymentsPdf(List<Payment> payments) {
        return buildPdf("Payments Report", document -> {
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            addHeaderCells(table, "Invoice No", "Student", "Amount", "Type", "Status");

            Font cellFont = new Font(Font.FontFamily.HELVETICA, 9);
            for (Payment p : payments) {
                table.addCell(new Phrase(p.getInvoiceNumber(), cellFont));
                table.addCell(new Phrase(p.getStudent() != null ? p.getStudent().getName() : "-", cellFont));
                table.addCell(new Phrase("Rs." + p.getAmount(), cellFont));
                table.addCell(new Phrase(p.getType().name(), cellFont));
                table.addCell(new Phrase(p.getStatus().name(), cellFont));
            }
            document.add(table);
        });
    }

    // ── PDF: Single invoice / receipt (Professional Tabular Format) ───

    private static final BaseColor TEAL_PRIMARY  = new BaseColor(0x0F, 0x76, 0x6E); // #0F766E
    private static final BaseColor TEAL_DARK     = new BaseColor(0x08, 0x33, 0x44); // #083344
    private static final BaseColor TEAL_LIGHT    = new BaseColor(0xF0, 0xFD, 0xFA); // #F0FDFA
    private static final BaseColor TEAL_TINT     = new BaseColor(0xCC, 0xFB, 0xF1); // #CCFBF1
    private static final BaseColor BORDER_SUBTLE = new BaseColor(0xE2, 0xE8, 0xF0); // #E2E8F0
    private static final BaseColor TEXT_MAIN     = new BaseColor(0x0F, 0x17, 0x2A); // #0F172A
    private static final BaseColor TEXT_MUTED    = new BaseColor(0x64, 0x74, 0x8B); // #64748B
    private static final BaseColor GOLD_ACCENT   = new BaseColor(0xD4, 0xAF, 0x37); // #D4AF37
    private static final BaseColor SUCCESS_GREEN = new BaseColor(0x05, 0x96, 0x69); // #059669
    private static final BaseColor SUCCESS_BG    = new BaseColor(0xEC, 0xFD, 0xF5); // #ECFDF5
    private static final BaseColor ROW_ALT       = new BaseColor(0xF8, 0xFA, 0xFC); // #F8FAFC

    // Embedded founder signature as fallback (Base64) to guarantee zero-failure rendering
    private static final String FOUNDER_SIGN_B64 =
        "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";

    public byte[] generateInvoicePdf(Student student, Payment payment) {
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PdfWriter.getInstance(document, out);
            document.open();

            buildProfessionalInvoice(document, student, payment);

            document.close();
            return out.toByteArray();
        } catch (DocumentException | IOException e) {
            log.error("PDF invoice generation failed", e);
            throw new RuntimeException("Could not generate PDF report");
        }
    }

    private void buildProfessionalInvoice(Document document, Student student, Payment payment) throws DocumentException {
        // ── 1. Header: Academy branding (Left) & Invoice Title / Status (Right) ──
        PdfPTable headerTable = new PdfPTable(new float[]{62f, 38f});
        headerTable.setWidthPercentage(100);
        headerTable.setSpacingAfter(6);

        // Left cell: Brand & Academy address
        PdfPCell leftCell = new PdfPCell();
        leftCell.setBorder(Rectangle.NO_BORDER);
        leftCell.setPadding(0);

        Font brandFont = new Font(Font.FontFamily.HELVETICA, 17, Font.BOLD, TEAL_PRIMARY);
        Paragraph brand = new Paragraph("THILLAI MARTIAL ARTS CLUB", brandFont);
        brand.setSpacingAfter(2);
        leftCell.addElement(brand);

        Font subBrandFont = new Font(Font.FontFamily.HELVETICA, 8f, Font.BOLD, GOLD_ACCENT);
        Paragraph subBrand = new Paragraph("AFFILIATED & CERTIFIED MARTIAL ARTS ACADEMY", subBrandFont);
        subBrand.setSpacingAfter(3);
        leftCell.addElement(subBrand);

        Font addrFont = new Font(Font.FontFamily.HELVETICA, 7.5f, Font.NORMAL, TEXT_MUTED);
        Paragraph addr = new Paragraph("2nd Floor, National Supermarket, Near Flyover, Sivapuri Main Rd, Chidambaram – 608001\nPhone: +91 80720 89377  |  Email: hartzone1974@gmail.com", addrFont);
        addr.setLeading(10.5f);
        leftCell.addElement(addr);
        headerTable.addCell(leftCell);

        // Right cell: Receipt label & status badge
        PdfPCell rightCell = new PdfPCell();
        rightCell.setBorder(Rectangle.NO_BORDER);
        rightCell.setPadding(0);
        rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        Font titleFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD, TEAL_DARK);
        Paragraph titleP = new Paragraph("FEES PAYMENT RECEIPT", titleFont);
        titleP.setAlignment(Element.ALIGN_RIGHT);
        titleP.setSpacingAfter(2);
        rightCell.addElement(titleP);

        Font copyFont = new Font(Font.FontFamily.HELVETICA, 8f, Font.NORMAL, TEXT_MUTED);
        Paragraph copyP = new Paragraph("ORIGINAL STUDENT COPY", copyFont);
        copyP.setAlignment(Element.ALIGN_RIGHT);
        copyP.setSpacingAfter(6);
        rightCell.addElement(copyP);

        // Status pill
        PdfPTable statusTable = new PdfPTable(1);
        statusTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
        statusTable.setTotalWidth(140f);
        statusTable.setLockedWidth(true);

        String statusText = "PAID - " + (payment.getStatus() != null ? payment.getStatus().name() : "SUCCESS");
        PdfPCell statusCell = new PdfPCell(new Phrase("✓  " + statusText, new Font(Font.FontFamily.HELVETICA, 8.5f, Font.BOLD, SUCCESS_GREEN)));
        statusCell.setBackgroundColor(SUCCESS_BG);
        statusCell.setBorderColor(SUCCESS_GREEN);
        statusCell.setBorderWidth(0.75f);
        statusCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        statusCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        statusCell.setPaddingTop(3);
        statusCell.setPaddingBottom(3);
        statusTable.addCell(statusCell);
        rightCell.addElement(statusTable);

        headerTable.addCell(rightCell);
        document.add(headerTable);

        // ── 2. Decorative Teal Divider ──
        PdfPTable lineTable = new PdfPTable(1);
        lineTable.setWidthPercentage(100);
        lineTable.setSpacingAfter(10);
        PdfPCell lineCell = new PdfPCell();
        lineCell.setFixedHeight(2.5f);
        lineCell.setBackgroundColor(TEAL_PRIMARY);
        lineCell.setBorder(Rectangle.NO_BORDER);
        lineTable.addCell(lineCell);
        document.add(lineTable);

        // ── 3. Two-Column Metadata Box (Receipt Information & Student Information) ──
        PdfPTable metaGrid = new PdfPTable(new float[]{49f, 2f, 49f});
        metaGrid.setWidthPercentage(100);
        metaGrid.setSpacingAfter(12);

        // Left box: Receipt Info
        PdfPCell receiptBox = new PdfPCell();
        receiptBox.setBackgroundColor(ROW_ALT);
        receiptBox.setBorderColor(BORDER_SUBTLE);
        receiptBox.setBorderWidth(0.8f);
        receiptBox.setPadding(8);

        Paragraph receiptHeader = new Paragraph("RECEIPT INFORMATION", new Font(Font.FontFamily.HELVETICA, 8.5f, Font.BOLD, TEAL_PRIMARY));
        receiptHeader.setSpacingAfter(6);
        receiptBox.addElement(receiptHeader);

        PdfPTable receiptInner = new PdfPTable(new float[]{42f, 58f});
        receiptInner.setWidthPercentage(100);
        addMetaRow(receiptInner, "Invoice / Receipt No:", payment.getInvoiceNumber() != null ? payment.getInvoiceNumber() : "-", true);
        addMetaRow(receiptInner, "Payment Date & Time:", formatDateTime(payment.getPaidAt() != null ? payment.getPaidAt() : payment.getCreatedAt()), false);
        addMetaRow(receiptInner, "Payment Mode:", payment.getRazorpayPaymentId() != null ? "Online (Razorpay)" : "Cash / Counter", false);
        addMetaRow(receiptInner, "Transaction / Pay ID:", payment.getRazorpayPaymentId() != null ? payment.getRazorpayPaymentId() : "-", false);
        receiptBox.addElement(receiptInner);
        metaGrid.addCell(receiptBox);

        // Spacer column
        PdfPCell spacerCell = new PdfPCell();
        spacerCell.setBorder(Rectangle.NO_BORDER);
        metaGrid.addCell(spacerCell);

        // Right box: Student Info
        PdfPCell studentBox = new PdfPCell();
        studentBox.setBackgroundColor(ROW_ALT);
        studentBox.setBorderColor(BORDER_SUBTLE);
        studentBox.setBorderWidth(0.8f);
        studentBox.setPadding(8);

        Paragraph studentHeader = new Paragraph("STUDENT INFORMATION", new Font(Font.FontFamily.HELVETICA, 8.5f, Font.BOLD, TEAL_PRIMARY));
        studentHeader.setSpacingAfter(6);
        studentBox.addElement(studentHeader);

        PdfPTable studentInner = new PdfPTable(new float[]{38f, 62f});
        studentInner.setWidthPercentage(100);
        addMetaRow(studentInner, "Student Name:", student != null && student.getName() != null ? student.getName() : "-", true);
        addMetaRow(studentInner, "Student ID:", student != null && student.getStudentId() != null ? student.getStudentId() : "-", true);
        addMetaRow(studentInner, "Contact Number:", student != null && student.getMobile() != null ? student.getMobile() : "-", false);
        String batchName = (student != null && student.getBatch() != null) ? student.getBatch().getName() : "Regular Training";
        addMetaRow(studentInner, "Assigned Batch:", batchName, false);
        studentBox.addElement(studentInner);
        metaGrid.addCell(studentBox);

        document.add(metaGrid);

        // ── 4. Tabular Particulars Table (Itemized Fee Rows & Columns) ──
        PdfPTable table = new PdfPTable(new float[]{8f, 44f, 20f, 14f, 14f});
        table.setWidthPercentage(100);
        table.setSpacingAfter(8);

        // Table Header
        Font thFont = new Font(Font.FontFamily.HELVETICA, 8.5f, Font.BOLD, BaseColor.WHITE);
        addTableTh(table, "S.NO", Element.ALIGN_CENTER, thFont);
        addTableTh(table, "FEE PARTICULARS / DESCRIPTION", Element.ALIGN_LEFT, thFont);
        addTableTh(table, "FEE PERIOD / TYPE", Element.ALIGN_CENTER, thFont);
        addTableTh(table, "FEE RATE", Element.ALIGN_RIGHT, thFont);
        addTableTh(table, "AMOUNT PAID", Element.ALIGN_RIGHT, thFont);

        // Row 1: The Paid Item
        Font tdFont = new Font(Font.FontFamily.HELVETICA, 8.5f, Font.NORMAL, TEXT_MAIN);
        Font tdBoldFont = new Font(Font.FontFamily.HELVETICA, 8.5f, Font.BOLD, TEXT_MAIN);
        Font tdMutedFont = new Font(Font.FontFamily.HELVETICA, 7.5f, Font.NORMAL, TEXT_MUTED);

        PdfPCell c1 = new PdfPCell(new Phrase("1", tdFont));
        c1.setHorizontalAlignment(Element.ALIGN_CENTER);
        c1.setPadding(8);
        c1.setBorderColor(BORDER_SUBTLE);
        table.addCell(c1);

        PdfPCell c2 = new PdfPCell();
        c2.setPadding(8);
        c2.setBorderColor(BORDER_SUBTLE);
        String descTitle = payment.getType() == com.thillai.martialarts.entity.PaymentType.REGISTRATION
                ? "Student Academy Registration & Admission Fee"
                : "Monthly Martial Arts Training & Coaching Fee";
        Paragraph pDesc = new Paragraph(descTitle, tdBoldFont);
        c2.addElement(pDesc);

        String enrolled = "-";
        if (student != null && student.getCourses() != null && !student.getCourses().isEmpty()) {
            enrolled = String.join(", ", student.getCourses().stream().map(c -> c.getName()).toList());
        }
        Paragraph pCourses = new Paragraph("Enrolled Courses: " + enrolled, tdMutedFont);
        pCourses.setSpacingBefore(2);
        c2.addElement(pCourses);
        table.addCell(c2);

        String periodText = payment.getType() == com.thillai.martialarts.entity.PaymentType.REGISTRATION
                ? "ONE-TIME ADMISSION"
                : (payment.getForMonth() != null ? "MONTH: " + payment.getForMonth() : "MONTHLY FEE");
        PdfPCell c3 = new PdfPCell(new Phrase(periodText, tdFont));
        c3.setHorizontalAlignment(Element.ALIGN_CENTER);
        c3.setPadding(8);
        c3.setBorderColor(BORDER_SUBTLE);
        table.addCell(c3);

        String amtStr = "Rs. " + payment.getAmount() + ".00";
        PdfPCell c4 = new PdfPCell(new Phrase(amtStr, tdFont));
        c4.setHorizontalAlignment(Element.ALIGN_RIGHT);
        c4.setPadding(8);
        c4.setBorderColor(BORDER_SUBTLE);
        table.addCell(c4);

        PdfPCell c5 = new PdfPCell(new Phrase(amtStr, tdBoldFont));
        c5.setHorizontalAlignment(Element.ALIGN_RIGHT);
        c5.setPadding(8);
        c5.setBorderColor(BORDER_SUBTLE);
        table.addCell(c5);

        // Subtotal row
        addSummaryRow(table, "Subtotal", amtStr, false);

        // Tax row
        addSummaryRow(table, "Taxes & Levies (Exempted)", "Rs. 0.00", false);

        // Total Amount Paid row (Prominently styled in Deep Teal theme)
        PdfPCell totalLabelCell = new PdfPCell(new Phrase("TOTAL AMOUNT PAID", new Font(Font.FontFamily.HELVETICA, 9.5f, Font.BOLD, TEAL_PRIMARY)));
        totalLabelCell.setColspan(3);
        totalLabelCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        totalLabelCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        totalLabelCell.setPadding(8);
        totalLabelCell.setBackgroundColor(TEAL_LIGHT);
        totalLabelCell.setBorderColor(TEAL_PRIMARY);
        totalLabelCell.setBorderWidthTop(1.5f);
        totalLabelCell.setBorderWidthBottom(1.5f);
        table.addCell(totalLabelCell);

        PdfPCell totalValCell = new PdfPCell(new Phrase(amtStr, new Font(Font.FontFamily.HELVETICA, 10.5f, Font.BOLD, TEAL_PRIMARY)));
        totalValCell.setColspan(2);
        totalValCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        totalValCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        totalValCell.setPadding(8);
        totalValCell.setBackgroundColor(TEAL_LIGHT);
        totalValCell.setBorderColor(TEAL_PRIMARY);
        totalValCell.setBorderWidthTop(1.5f);
        totalValCell.setBorderWidthBottom(1.5f);
        table.addCell(totalValCell);

        // Amount in words row
        PdfPCell wordsCell = new PdfPCell();
        wordsCell.setColspan(5);
        wordsCell.setPadding(6);
        wordsCell.setBackgroundColor(ROW_ALT);
        wordsCell.setBorderColor(BORDER_SUBTLE);

        Paragraph wordsP = new Paragraph();
        wordsP.add(new Chunk("Amount Paid in Words:  ", new Font(Font.FontFamily.HELVETICA, 8f, Font.BOLD, TEXT_MUTED)));
        wordsP.add(new Chunk(convertAmountToWords(payment.getAmount() != null ? payment.getAmount() : 0), new Font(Font.FontFamily.HELVETICA, 8.5f, Font.BOLD, TEXT_MAIN)));
        wordsCell.addElement(wordsP);
        table.addCell(wordsCell);

        document.add(table);

        // ── 5. Bottom Section: Notes on Left & Founder Signature on Right Corner ──
        PdfPTable footerGrid = new PdfPTable(new float[]{55f, 45f});
        footerGrid.setWidthPercentage(100);
        footerGrid.setSpacingBefore(12);

        // Left Cell: Terms & Verification Seal
        PdfPCell notesCell = new PdfPCell();
        notesCell.setBorder(Rectangle.NO_BORDER);
        notesCell.setPadding(4);

        Paragraph termsTitle = new Paragraph("RECEIPT TERMS & GUIDELINES", new Font(Font.FontFamily.HELVETICA, 8f, Font.BOLD, TEXT_MUTED));
        termsTitle.setSpacingAfter(4);
        notesCell.addElement(termsTitle);

        Font noteFont = new Font(Font.FontFamily.HELVETICA, 7.2f, Font.NORMAL, TEXT_MUTED);
        Paragraph note1 = new Paragraph("• Fees once paid are non-refundable and non-transferable under any circumstances.", noteFont);
        Paragraph note2 = new Paragraph("• Please preserve this official computer-generated receipt for student record & belt gradings.", noteFont);
        Paragraph note3 = new Paragraph("• Students must strictly adhere to the allocated training schedule and uniform standards.", noteFont);
        Paragraph note4 = new Paragraph("• For renewals or fee enquiries, contact academy administration at +91 80720 89377.", noteFont);
        note1.setLeading(9.5f); note2.setLeading(9.5f); note3.setLeading(9.5f); note4.setLeading(9.5f);
        notesCell.addElement(note1);
        notesCell.addElement(note2);
        notesCell.addElement(note3);
        notesCell.addElement(note4);

        // Security check badge
        PdfPTable checkBadge = new PdfPTable(1);
        checkBadge.setWidthPercentage(100);
        checkBadge.setSpacingBefore(8);
        PdfPCell cBadge = new PdfPCell(new Phrase("✓  Officially Authenticated Payment  ·  Thillai Martial Arts Club", new Font(Font.FontFamily.HELVETICA, 7.5f, Font.BOLD, TEAL_PRIMARY)));
        cBadge.setBackgroundColor(TEAL_LIGHT);
        cBadge.setBorderColor(TEAL_TINT);
        cBadge.setBorderWidth(0.5f);
        cBadge.setPadding(4);
        checkBadge.addCell(cBadge);
        notesCell.addElement(checkBadge);

        footerGrid.addCell(notesCell);

        // Right Cell: Authentic Founder Signature Block (like in ID Card)
        PdfPCell signCell = new PdfPCell();
        signCell.setBorder(Rectangle.NO_BORDER);
        signCell.setPadding(4);
        signCell.setHorizontalAlignment(Element.ALIGN_CENTER);

        PdfPTable signBox = new PdfPTable(1);
        signBox.setWidthPercentage(75);
        signBox.setHorizontalAlignment(Element.ALIGN_RIGHT);

        // Signature image
        Image signatureImage = loadFounderSignature();
        PdfPCell imgCell = new PdfPCell();
        imgCell.setBorder(Rectangle.NO_BORDER);
        imgCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        imgCell.setVerticalAlignment(Element.ALIGN_BOTTOM);
        imgCell.setFixedHeight(48f);

        if (signatureImage != null) {
            signatureImage.scaleToFit(140f, 42f);
            signatureImage.setAlignment(Element.ALIGN_CENTER);
            imgCell.addElement(signatureImage);
        } else {
            Paragraph textSign = new Paragraph("Master R. HariHaran", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, TEAL_PRIMARY));
            textSign.setAlignment(Element.ALIGN_CENTER);
            imgCell.addElement(textSign);
        }
        signBox.addCell(imgCell);

        // Signature horizontal divider line
        PdfPCell signLine = new PdfPCell();
        signLine.setFixedHeight(1.5f);
        signLine.setBackgroundColor(TEAL_PRIMARY);
        signLine.setBorder(Rectangle.NO_BORDER);
        signBox.addCell(signLine);

        // Founder Name
        Font fnNameFont = new Font(Font.FontFamily.HELVETICA, 9.5f, Font.BOLD, TEAL_PRIMARY);
        Paragraph pSignName = new Paragraph("MASTER R. HARIHARAN", fnNameFont);
        pSignName.setAlignment(Element.ALIGN_CENTER);
        pSignName.setSpacingBefore(3);

        // Role & Academy
        Font fnRoleFont = new Font(Font.FontFamily.HELVETICA, 8f, Font.BOLD, TEXT_MUTED);
        Paragraph pSignRole = new Paragraph("FOUNDER & CHIEF INSTRUCTOR", fnRoleFont);
        pSignRole.setAlignment(Element.ALIGN_CENTER);

        Font fnAuthFont = new Font(Font.FontFamily.HELVETICA, 7f, Font.ITALIC, TEXT_MUTED);
        Paragraph pSignAuth = new Paragraph("Authorized Academy Signatory", fnAuthFont);
        pSignAuth.setAlignment(Element.ALIGN_CENTER);

        PdfPCell labelCell = new PdfPCell();
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        labelCell.addElement(pSignName);
        labelCell.addElement(pSignRole);
        labelCell.addElement(pSignAuth);
        signBox.addCell(labelCell);

        signCell.addElement(signBox);
        footerGrid.addCell(signCell);

        document.add(footerGrid);

        // ── 6. Bottom Document Footer Note ──
        Paragraph docFooter = new Paragraph(
                "Thank you for training with Thillai Martial Arts Club · Chidambaram, Tamil Nadu · Together We Build Discipline & Champions",
                new Font(Font.FontFamily.HELVETICA, 7.5f, Font.ITALIC, TEXT_MUTED));
        docFooter.setAlignment(Element.ALIGN_CENTER);
        docFooter.setSpacingBefore(18);
        document.add(docFooter);
    }

    private void addMetaRow(PdfPTable table, String label, String value, boolean isBold) {
        PdfPCell lbl = new PdfPCell(new Phrase(label, new Font(Font.FontFamily.HELVETICA, 7.5f, Font.BOLD, TEXT_MUTED)));
        lbl.setBorder(Rectangle.NO_BORDER);
        lbl.setPaddingTop(2);
        lbl.setPaddingBottom(2);
        table.addCell(lbl);

        Font valFont = new Font(Font.FontFamily.HELVETICA, 8f, isBold ? Font.BOLD : Font.NORMAL, TEXT_MAIN);
        PdfPCell val = new PdfPCell(new Phrase(value != null ? value : "-", valFont));
        val.setBorder(Rectangle.NO_BORDER);
        val.setPaddingTop(2);
        val.setPaddingBottom(2);
        table.addCell(val);
    }

    private void addTableTh(PdfPTable table, String header, int align, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(header, font));
        cell.setBackgroundColor(TEAL_PRIMARY);
        cell.setHorizontalAlignment(align);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(6);
        cell.setBorderColor(TEAL_DARK);
        table.addCell(cell);
    }

    private void addSummaryRow(PdfPTable table, String label, String amount, boolean isTotal) {
        Font fLabel = new Font(Font.FontFamily.HELVETICA, 8f, Font.BOLD, TEXT_MUTED);
        PdfPCell lbl = new PdfPCell(new Phrase(label, fLabel));
        lbl.setColspan(3);
        lbl.setHorizontalAlignment(Element.ALIGN_RIGHT);
        lbl.setPadding(5);
        lbl.setBorderColor(BORDER_SUBTLE);
        table.addCell(lbl);

        Font fVal = new Font(Font.FontFamily.HELVETICA, 8.5f, Font.BOLD, TEXT_MAIN);
        PdfPCell val = new PdfPCell(new Phrase(amount, fVal));
        val.setColspan(2);
        val.setHorizontalAlignment(Element.ALIGN_RIGHT);
        val.setPadding(5);
        val.setBorderColor(BORDER_SUBTLE);
        table.addCell(val);
    }

    private Image loadFounderSignature() {
        // 1. Try classpath resource
        try (InputStream is = getClass().getResourceAsStream("/images/founder-signature.png")) {
            if (is != null) {
                byte[] bytes = is.readAllBytes();
                return Image.getInstance(bytes);
            }
        } catch (Exception e) {
            log.debug("Classpath signature not loaded: {}", e.getMessage());
        }

        // 2. Try file system
        try {
            Path path = Paths.get("frontend/public/images/founder-signature.png");
            if (Files.exists(path)) {
                return Image.getInstance(path.toAbsolutePath().toString());
            }
        } catch (Exception e) {
            log.debug("Filesystem signature not loaded: {}", e.getMessage());
        }

        // 3. Fallback to embedded Base64 string
        try {
            byte[] bytes = Base64.getDecoder().decode(FOUNDER_SIGN_B64);
            return Image.getInstance(bytes);
        } catch (Exception e) {
            log.error("Embedded signature decoding failed: {}", e.getMessage());
            return null;
        }
    }

    private String formatDateTime(LocalDateTime dt) {
        if (dt == null) return "-";
        return dt.format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));
    }

    private String convertAmountToWords(int amount) {
        if (amount <= 0) return "Zero Rupees Only";
        return convertNumberToWords(amount) + " Rupees Only";
    }

    private static final String[] UNITS = {
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    };
    private static final String[] TENS = {
        "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    };

    private String convertNumberToWords(int n) {
        if (n < 20) return UNITS[n];
        if (n < 100) return TENS[n / 10] + ((n % 10 != 0) ? " " + UNITS[n % 10] : "");
        if (n < 1000) return UNITS[n / 100] + " Hundred" + ((n % 100 != 0) ? " " + convertNumberToWords(n % 100) : "");
        if (n < 100000) return convertNumberToWords(n / 1000) + " Thousand" + ((n % 1000 != 0) ? " " + convertNumberToWords(n % 1000) : "");
        if (n < 10000000) return convertNumberToWords(n / 100000) + " Lakh" + ((n % 100000 != 0) ? " " + convertNumberToWords(n % 100000) : "");
        return convertNumberToWords(n / 10000000) + " Crore" + ((n % 10000000 != 0) ? " " + convertNumberToWords(n % 10000000) : "");
    }

    // ── Shared PDF scaffold (Used for Student Roster & Payments Ledger) ──

    private interface BodyWriter {
        void write(Document document) throws DocumentException;
    }

    private byte[] buildPdf(String title, BodyWriter bodyWriter) {
        Document document = new Document(PageSize.A4, 36, 36, 54, 36);
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, DARK);
            Paragraph header = new Paragraph("THILLAI MARTIAL ARTS CLUB", titleFont);
            header.setAlignment(Element.ALIGN_CENTER);
            document.add(header);

            Font subFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL, GOLD);
            Paragraph sub = new Paragraph(title, subFont);
            sub.setAlignment(Element.ALIGN_CENTER);
            sub.setSpacingAfter(16);
            document.add(sub);

            bodyWriter.write(document);

            document.close();
            return out.toByteArray();
        } catch (DocumentException | IOException e) {
            log.error("PDF generation failed", e);
            throw new RuntimeException("Could not generate PDF report");
        }
    }

    private void addHeaderCells(PdfPTable table, String... headers) {
        Font headerFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.WHITE);
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
            cell.setBackgroundColor(DARK);
            cell.setPadding(6);
            table.addCell(cell);
        }
    }
}