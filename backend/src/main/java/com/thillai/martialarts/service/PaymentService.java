package com.thillai.martialarts.service;

import com.razorpay.Order;
import com.thillai.martialarts.dto.request.PaymentOrderRequest;
import com.thillai.martialarts.dto.request.PaymentVerifyRequest;
import com.thillai.martialarts.dto.response.CourseFeeDetail;
import com.thillai.martialarts.dto.response.DueResponse;
import com.thillai.martialarts.dto.response.PaymentHistoryResponse;
import com.thillai.martialarts.entity.Course;
import com.thillai.martialarts.entity.Payment;
import com.thillai.martialarts.entity.PaymentStatus;
import com.thillai.martialarts.entity.PaymentType;
import com.thillai.martialarts.entity.Student;
import com.thillai.martialarts.exception.ResourceNotFoundException;
import com.thillai.martialarts.repository.PaymentRepository;
import com.thillai.martialarts.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final StudentRepository studentRepository;
    private final RazorpayService razorpayService;
    private final ReportService reportService;
    private final EmailService emailService;

    @Value("${app.fee.per-course}")
    private int feePerCourse;

    /** Generic Razorpay order creation, used for both registration and monthly-fee checkout. */
    public JSONObject createOrder(PaymentOrderRequest request) {
        Order order = razorpayService.createOrder(request);
        return razorpayService.toCheckoutPayload(order);
    }

    /**
     * Verifies and records a **monthly fee** payment (the registration
     * payment is verified+recorded inline inside StudentService.register,
     * since it happens atomically with account creation).
     */
    @Transactional
    public PaymentHistoryResponse verifyAndRecordMonthlyPayment(PaymentVerifyRequest request) {
        razorpayService.verifySignature(request.getRazorpayOrderId(), request.getRazorpayPaymentId(), request.getRazorpaySignature());

        Student student = studentRepository.findByStudentId(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + request.getStudentId()));

        String currentMonth = YearMonth.now().toString();
        List<Payment> monthPayments = paymentRepository
                .findByStudentIdAndForMonthAndStatus(student.getId(), currentMonth, PaymentStatus.SUCCESS);
        int totalPaid = monthPayments.stream().mapToInt(Payment::getAmount).sum();

        List<Course> courses = student.getCourses() != null ? student.getCourses() : java.util.Collections.emptyList();
        int calculatedFee = courses.stream().mapToInt(Course::getFeePerMonth).sum();
        int totalFee = student.getMonthlyFee() != null && student.getMonthlyFee() > 0
                ? student.getMonthlyFee()
                : (calculatedFee > 0 ? calculatedFee : feePerCourse * courses.size());

        int dueAmount = Math.max(0, totalFee - totalPaid);
        int amountToRecord = dueAmount > 0 ? dueAmount : (totalFee > 0 ? totalFee : feePerCourse);

        Payment payment = Payment.builder()
                .student(student)
                .amount(amountToRecord)
                .currency("INR")
                .razorpayOrderId(request.getRazorpayOrderId())
                .razorpayPaymentId(request.getRazorpayPaymentId())
                .razorpaySignature(request.getRazorpaySignature())
                .status(PaymentStatus.SUCCESS)
                .type(PaymentType.MONTHLY_FEE)
                .forMonth(currentMonth)
                .invoiceNumber(generateInvoiceNumber())
                .paidAt(LocalDateTime.now())
                .build();
        payment = paymentRepository.save(payment);

        emailService.sendPaymentReceipt(student, payment);

        return mapToHistoryResponse(payment);
    }

    @Transactional(readOnly = true)
    public DueResponse getDue(String studentId) {
        Student student = studentRepository.findByStudentId(studentId)
                .or(() -> studentRepository.findByMobile(studentId))
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));

        String currentMonth = YearMonth.now().toString();
        List<Payment> monthPayments = paymentRepository
                .findByStudentIdAndForMonthAndStatus(student.getId(), currentMonth, PaymentStatus.SUCCESS);
        int totalPaid = monthPayments.stream().mapToInt(Payment::getAmount).sum();

        List<Course> courses = student.getCourses() != null ? student.getCourses() : java.util.Collections.emptyList();
        int calculatedFee = courses.stream().mapToInt(Course::getFeePerMonth).sum();
        int totalFee = student.getMonthlyFee() != null && student.getMonthlyFee() > 0
                ? student.getMonthlyFee()
                : calculatedFee;

        int dueAmount = Math.max(0, totalFee - totalPaid);
        String displayMonth = YearMonth.now().format(DateTimeFormatter.ofPattern("MMMM yyyy"));

        // Per-course breakdown
        int runningPaid = totalPaid;
        List<CourseFeeDetail> courseDetails = new ArrayList<>();
        for (Course c : courses) {
            int fee = c.getFeePerMonth() != null ? c.getFeePerMonth() : 0;
            boolean isPaid = false;
            if (fee == 0 || runningPaid >= fee) {
                isPaid = true;
                runningPaid -= fee;
            }
            courseDetails.add(CourseFeeDetail.builder()
                    .courseId(c.getId())
                    .courseName(c.getName())
                    .slug(c.getSlug())
                    .fee(fee)
                    .status(isPaid ? "PAID" : "UNPAID")
                    .batchName(c.getBatch() != null ? c.getBatch().getName() : (student.getBatch() != null ? student.getBatch().getName() : null))
                    .build());
        }

        return DueResponse.builder()
                .amount(dueAmount)
                .month(displayMonth)
                .totalMonthlyFee(totalFee)
                .paidAmount(totalPaid)
                .courseDetails(courseDetails)
                .build();
    }

    @Transactional(readOnly = true)
    public List<PaymentHistoryResponse> getHistory(String studentId) {
        Student student = studentRepository.findByStudentId(studentId)
                .or(() -> studentRepository.findByMobile(studentId))
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));

        return paymentRepository.findByStudentIdOrderByCreatedAtDesc(student.getId()).stream()
                .map(this::mapToHistoryResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<PaymentHistoryResponse> getAll(Pageable pageable) {
        return paymentRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::mapToHistoryResponse);
    }

    @Transactional(readOnly = true)
    public byte[] downloadInvoice(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + paymentId));
        return reportService.generateInvoicePdf(payment.getStudent(), payment);
    }

    @Transactional(readOnly = true)
    public byte[] exportPaymentsPdf() {
        return reportService.generatePaymentsPdf(paymentRepository.findAll());
    }

    private PaymentHistoryResponse mapToHistoryResponse(Payment p) {
        String monthLabel = p.getForMonth() != null
                ? YearMonth.parse(p.getForMonth()).getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH)
                  + " " + YearMonth.parse(p.getForMonth()).getYear()
                : "-";

        return PaymentHistoryResponse.builder()
                .id(p.getId())
                .date(p.getPaidAt() != null ? p.getPaidAt().toLocalDate().toString() : p.getCreatedAt().toLocalDate().toString())
                .month(monthLabel)
                .amount(p.getAmount())
                .status(p.getStatus().name())
                .studentName(p.getStudent() != null ? p.getStudent().getName() : null)
                .method("Razorpay")
                .build();
    }

    private String generateInvoiceNumber() {
        String stamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "INV-" + stamp + "-" + (int) (Math.random() * 900 + 100);
    }
}
