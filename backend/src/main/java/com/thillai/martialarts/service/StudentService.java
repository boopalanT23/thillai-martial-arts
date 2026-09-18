package com.thillai.martialarts.service;

import com.thillai.martialarts.dto.request.StudentRegistrationRequest;
import com.thillai.martialarts.dto.response.CourseFeeDetail;
import com.thillai.martialarts.dto.response.RegistrationResponse;
import com.thillai.martialarts.dto.response.StudentResponse;
import com.thillai.martialarts.entity.*;
import com.thillai.martialarts.exception.BadRequestException;
import com.thillai.martialarts.exception.ResourceNotFoundException;
import com.thillai.martialarts.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final BatchRepository batchRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;
    private final PaymentRepository paymentRepository;
    private final AttendanceRepository attendanceRepository;
    private final NotificationRepository notificationRepository;
    private final StudentIdCardRepository studentIdCardRepository;
    private final FileStorageService fileStorageService;
    private final RazorpayService razorpayService;
    private final IdCardService idCardService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public RegistrationResponse register(StudentRegistrationRequest request, MultipartFile photo, MultipartFile aadhaarPdf) {

        if (studentRepository.existsByMobile(request.getMobile())) {
            throw new BadRequestException("A student with this mobile number is already registered. " +
                    "Please use the Student Login to access your existing account.");
        }

        // 1. Resolve courses and compute fee
        List<Course> courses = request.getCourses().stream()
                .map(slug -> courseRepository.findBySlug(slug)
                        .orElseThrow(() -> new BadRequestException("Unknown course: " + slug)))
                .toList();

        if (courses.isEmpty()) {
            throw new BadRequestException("Please select at least one course");
        }

        int totalFee = courses.stream().mapToInt(Course::getFeePerMonth).sum();

        // 2. Verify the Razorpay payment that was just completed client-side
        razorpayService.verifySignature(request.getRazorpayOrderId(), request.getRazorpayPaymentId(), request.getRazorpaySignature());

        // 3. Store uploaded files
        String photoUrl = fileStorageService.store(photo, "photos");
        String aadhaarUrl = (aadhaarPdf != null && !aadhaarPdf.isEmpty())
                ? fileStorageService.store(aadhaarPdf, "aadhaar")
                : null;

        // 4. Generate Student ID
        String studentId = generateStudentId();

        // 5. Create student user identity with encrypted desirable password
        User user = User.builder()
                .username(studentId)
                .password(passwordEncoder.encode(request.getPassword().trim()))
                .role(Role.STUDENT)
                .enabled(true)
                .build();
        user = userRepository.save(user);

        // 6. Create the Student record
        LocalDate parsedDob = request.getDob() != null ? LocalDate.parse(request.getDob().trim()) : null;
        Integer calculatedAge = request.getAge();
        if (calculatedAge == null && parsedDob != null) {
            calculatedAge = java.time.Period.between(parsedDob, LocalDate.now()).getYears();
        }

        Student student = Student.builder()
                .studentId(studentId)
                .name(request.getName())
                .age(calculatedAge)
                .dob(parsedDob)
                .mobile(request.getMobile())
                .photoUrl(photoUrl)
                .aadhaarPdfUrl(aadhaarUrl)
                .joiningDate(LocalDate.parse(request.getJoiningDate()))
                .reasonForJoining(request.getReason())
                .batch(courses.get(0).getBatch())
                .courses(courses)
                .user(user)
                .monthlyFee(totalFee)
                .build();
        student = studentRepository.save(student);

        // 6. Record the payment
        Payment payment = Payment.builder()
                .student(student)
                .amount(totalFee)
                .currency("INR")
                .razorpayOrderId(request.getRazorpayOrderId())
                .razorpayPaymentId(request.getRazorpayPaymentId())
                .razorpaySignature(request.getRazorpaySignature())
                .status(PaymentStatus.SUCCESS)
                .type(PaymentType.REGISTRATION)
                .forMonth(YearMonth.now().toString())
                .invoiceNumber(generateInvoiceNumber())
                .paidAt(LocalDateTime.now())
                .build();
        payment = paymentRepository.save(payment);

        // 7. Audit registration record
        String coursesSnapshot = String.join(", ", courses.stream().map(Course::getName).toList());
        registrationRepository.save(Registration.builder()
                .student(student)
                .coursesSnapshot(coursesSnapshot)
                .totalFee(totalFee)
                .payment(payment)
                .status("CONFIRMED")
                .build());

        // 8. Issue the digital ID card + notify
        idCardService.issue(student);
        emailService.sendRegistrationConfirmation(student);
        emailService.sendPaymentReceipt(student, payment);

        return RegistrationResponse.builder()
                .studentId(student.getStudentId())
                .name(student.getName())
                .totalFee(totalFee)
                .message("Registration successful! Welcome to Thillai Martial Arts Club.")
                .build();
    }

    @Transactional(readOnly = true)
    public StudentResponse getCurrentStudentProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .or(() -> studentRepository.findByStudentId(username).map(Student::getUser))
                .or(() -> studentRepository.findByMobile(username).map(Student::getUser))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Student student = studentRepository.findByUser(user)
                .or(() -> studentRepository.findByUserId(user.getId()))
                .or(() -> studentRepository.findByStudentId(username))
                .or(() -> studentRepository.findByMobile(username))
                .or(() -> studentRepository.findAll().stream()
                        .filter(s -> s.getUser() != null && s.getUser().getId().equals(user.getId()))
                        .findFirst())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return mapToResponse(student);
    }

    @Transactional(readOnly = true)
    public StudentResponse getById(Long id) {
        return mapToResponse(findEntityById(id));
    }

    @Transactional(readOnly = true)
    public Student findEntityById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + id));
    }

    /** Exact-match lookup by Student ID or mobile — used by the public Monthly Fees search. */
    @Transactional(readOnly = true)
    public StudentResponse search(String identifier) {
        Student student = studentRepository.findByStudentId(identifier)
                .or(() -> studentRepository.findByMobile(identifier))
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No student found with that Student ID or mobile number"));
        return mapToResponse(student);
    }

    /** Paginated, fuzzy-match list for the Admin Panel's Students table. */
    @Transactional(readOnly = true)
    public Page<StudentResponse> getAll(String query, Pageable pageable) {
        Page<Student> page = (query == null || query.isBlank())
                ? studentRepository.findAll(pageable)
                : studentRepository.search(query, pageable);
        return page.map(this::mapToResponse);
    }

    @Transactional
    public StudentResponse update(Long id, StudentResponse updates) {
        Student student = findEntityById(id);

        if (updates.getName() != null && !updates.getName().trim().isEmpty()) {
            student.setName(updates.getName().trim());
        }

        if (updates.getMobile() != null && !updates.getMobile().trim().isEmpty() && !updates.getMobile().trim().equals(student.getMobile())) {
            String newMobile = updates.getMobile().trim();
            if (studentRepository.existsByMobile(newMobile)) {
                throw new BadRequestException("A student with mobile number " + newMobile + " is already registered.");
            }
            student.setMobile(newMobile);
            if (student.getUser() != null) {
                student.getUser().setUsername(newMobile);
                userRepository.save(student.getUser());
            }
        }

        if (updates.getDob() != null && !updates.getDob().trim().isEmpty()) {
            try {
                LocalDate dob = LocalDate.parse(updates.getDob().trim());
                student.setDob(dob);
                student.setAge(java.time.Period.between(dob, LocalDate.now()).getYears());
            } catch (Exception ignored) {}
        }

        if (updates.getAge() != null && updates.getAge() > 0) {
            student.setAge(updates.getAge());
        }

        if (updates.getJoiningDate() != null && !updates.getJoiningDate().trim().isEmpty()) {
            try {
                student.setJoiningDate(LocalDate.parse(updates.getJoiningDate().trim()));
            } catch (Exception ignored) {}
        }

        if (updates.getCourses() != null && !updates.getCourses().isEmpty()) {
            List<Course> allCourses = courseRepository.findAll();
            List<Course> matchedCourses = new java.util.ArrayList<>();
            for (String cNameOrSlug : updates.getCourses()) {
                String term = cNameOrSlug.trim();
                allCourses.stream()
                        .filter(c -> c.getName().equalsIgnoreCase(term) || c.getSlug().equalsIgnoreCase(term))
                        .findFirst()
                        .ifPresent(matchedCourses::add);
            }
            if (!matchedCourses.isEmpty()) {
                student.setCourses(matchedCourses);
                int totalFee = matchedCourses.stream().mapToInt(Course::getFeePerMonth).sum();
                student.setMonthlyFee(totalFee);
                if (student.getBatch() == null && updates.getBatchName() == null) {
                    student.setBatch(matchedCourses.get(0).getBatch());
                }
            }
        }

        if (updates.getBatchName() != null && !updates.getBatchName().trim().isEmpty()) {
            batchRepository.findByName(updates.getBatchName().trim())
                    .ifPresent(student::setBatch);
        }

        if (updates.getFeeStatus() != null && !updates.getFeeStatus().trim().isEmpty()) {
            String currentMonth = YearMonth.now().toString();
            List<Payment> currentMonthPayments = paymentRepository
                    .findByStudentIdAndForMonthAndStatus(student.getId(), currentMonth, PaymentStatus.SUCCESS);
            int totalPaid = currentMonthPayments.stream().mapToInt(Payment::getAmount).sum();
            int currentTotalFee = student.getMonthlyFee() != null && student.getMonthlyFee() > 0
                    ? student.getMonthlyFee()
                    : student.getCourses().stream().mapToInt(Course::getFeePerMonth).sum();

            if ("PAID".equalsIgnoreCase(updates.getFeeStatus().trim())) {
                int remainingDue = Math.max(0, currentTotalFee - totalPaid);
                if (remainingDue > 0) {
                    Payment manualPayment = Payment.builder()
                            .student(student)
                            .amount(remainingDue)
                            .currency("INR")
                            .razorpayOrderId("ADMIN_MANUAL_" + System.currentTimeMillis())
                            .razorpayPaymentId("ADMIN_" + System.currentTimeMillis())
                            .razorpaySignature("ADMIN_RECORDED")
                            .status(PaymentStatus.SUCCESS)
                            .type(PaymentType.MONTHLY_FEE)
                            .forMonth(currentMonth)
                            .invoiceNumber(generateInvoiceNumber())
                            .paidAt(LocalDateTime.now())
                            .build();
                    paymentRepository.save(manualPayment);
                }
            } else if ("PENDING".equalsIgnoreCase(updates.getFeeStatus().trim()) || "UNPAID".equalsIgnoreCase(updates.getFeeStatus().trim())) {
                for (Payment p : currentMonthPayments) {
                    p.setStatus(PaymentStatus.FAILED);
                    paymentRepository.save(p);
                }
            }
        }

        student = studentRepository.save(student);
        return mapToResponse(student);
    }

    @Transactional
    public void delete(Long id) {
        Student student = findEntityById(id);

        // 1. Delete associated Attendance records
        attendanceRepository.deleteByStudentId(id);

        // 2. Delete associated Notifications for this student
        notificationRepository.deleteByStudentId(id);

        // 3. Delete Registrations (must precede payments because registrations.payment_id references payments.id)
        registrationRepository.deleteByStudentId(id);

        // 4. Delete Payments
        paymentRepository.deleteByStudentId(id);

        // 5. Delete Student ID Card
        studentIdCardRepository.deleteByStudentId(id);

        // 6. Delete student courses join table entries
        studentRepository.deleteStudentCourses(id);

        // 7. Clean up stored files if any
        if (student.getPhotoUrl() != null) {
            fileStorageService.delete(student.getPhotoUrl());
        }
        if (student.getAadhaarPdfUrl() != null) {
            fileStorageService.delete(student.getAadhaarPdfUrl());
        }

        // 8. Capture linked User account before removing student
        User user = student.getUser();
        if (user != null) {
            student.setUser(null);
            studentRepository.saveAndFlush(student);
        }

        // 9. Delete student entity
        studentRepository.delete(student);
        studentRepository.flush();

        // 10. Delete linked user account if exists
        if (user != null) {
            userRepository.delete(user);
        }
    }

    @Transactional
    public void resetStudentPassword(Long studentId, String newPassword) {
        if (newPassword == null || newPassword.trim().length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters");
        }
        Student student = findEntityById(studentId);
        User user = student.getUser();
        if (user == null) {
            user = User.builder()
                    .username(student.getStudentId())
                    .password(passwordEncoder.encode(newPassword.trim()))
                    .role(Role.STUDENT)
                    .enabled(true)
                    .build();
            user = userRepository.save(user);
            student.setUser(user);
            studentRepository.save(student);
        } else {
            user.setPassword(passwordEncoder.encode(newPassword.trim()));
            userRepository.save(user);
        }
    }

    @Transactional(readOnly = true)
    public List<Student> findAllForExport() {
        return studentRepository.findAllWithDetails();
    }

    @Transactional
    public StudentResponse updateAadhaar(Long id, MultipartFile aadhaarPdf) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new com.thillai.martialarts.exception.ResourceNotFoundException("Student not found with ID: " + id));
        if (student.getAadhaarPdfUrl() != null) {
            fileStorageService.delete(student.getAadhaarPdfUrl());
        }
        String newUrl = (aadhaarPdf != null && !aadhaarPdf.isEmpty())
                ? fileStorageService.store(aadhaarPdf, "aadhaar")
                : null;
        student.setAadhaarPdfUrl(newUrl);
        student = studentRepository.save(student);
        return mapToResponse(student);
    }

    public StudentResponse mapToResponse(Student student) {
        String currentMonth = YearMonth.now().toString();
        List<Payment> monthPayments = paymentRepository
                .findByStudentIdAndForMonthAndStatus(student.getId(), currentMonth, PaymentStatus.SUCCESS);

        int totalPaidThisMonth = monthPayments.stream().mapToInt(Payment::getAmount).sum();

        List<Course> courses = student.getCourses() != null ? student.getCourses() : java.util.Collections.emptyList();
        int calculatedMonthlyFee = courses.stream().mapToInt(Course::getFeePerMonth).sum();
        int monthlyFee = (student.getMonthlyFee() != null && student.getMonthlyFee() > 0)
                ? student.getMonthlyFee()
                : calculatedMonthlyFee;

        // Allocate payments across courses in order to track individual course status
        int remainingPaid = totalPaidThisMonth;
        List<CourseFeeDetail> courseFeeDetails = new ArrayList<>();
        for (Course c : courses) {
            int fee = c.getFeePerMonth() != null ? c.getFeePerMonth() : 0;
            boolean isCoursePaid = false;
            if (fee == 0 || remainingPaid >= fee) {
                isCoursePaid = true;
                remainingPaid -= fee;
            }
            courseFeeDetails.add(CourseFeeDetail.builder()
                    .courseId(c.getId())
                    .courseName(c.getName())
                    .slug(c.getSlug())
                    .fee(fee)
                    .status(isCoursePaid ? "PAID" : "UNPAID")
                    .batchName(c.getBatch() != null ? c.getBatch().getName() : (student.getBatch() != null ? student.getBatch().getName() : null))
                    .build());
        }

        int dueFee = Math.max(0, monthlyFee - totalPaidThisMonth);
        boolean isFullyPaid = (monthlyFee > 0 && dueFee == 0) || (courses.isEmpty() && totalPaidThisMonth > 0);

        return StudentResponse.builder()
                .id(student.getId())
                .studentId(student.getStudentId())
                .name(student.getName())
                .age(student.getAge())
                .dob(student.getDob() != null ? student.getDob().toString() : null)
                .mobile(student.getMobile())
                .photo(student.getPhotoUrl())
                .aadhaarPdfUrl(student.getAadhaarPdfUrl())
                .courses(courses.stream().map(Course::getName).toList())
                .courseFeeDetails(courseFeeDetails)
                .batchName(student.getBatch() != null ? student.getBatch().getName() : null)
                .days(student.getBatch() != null ? student.getBatch().getDays() : null)
                .time(student.getBatch() != null ? student.getBatch().getTime() : null)
                .joiningDate(student.getJoiningDate() != null ? student.getJoiningDate().toString() : null)
                .monthlyFee(monthlyFee)
                .paidFee(totalPaidThisMonth)
                .dueFee(dueFee)
                .feeStatus(isFullyPaid ? "PAID" : "PENDING")
                .build();
    }

    private synchronized String generateStudentId() {
        long maxSeq = 0;

        List<String> studentIds = studentRepository.findAllStudentIds();
        if (studentIds != null) {
            for (String id : studentIds) {
                if (id != null && id.toUpperCase().startsWith("TMA")) {
                    try {
                        long seq = Long.parseLong(id.substring(3).trim());
                        if (seq > maxSeq) {
                            maxSeq = seq;
                        }
                    } catch (NumberFormatException ignored) {}
                }
            }
        }

        List<String> userIds = userRepository.findTmaUsernames();
        if (userIds != null) {
            for (String u : userIds) {
                if (u != null && u.toUpperCase().startsWith("TMA")) {
                    try {
                        long seq = Long.parseLong(u.substring(3).trim());
                        if (seq > maxSeq) {
                            maxSeq = seq;
                        }
                    } catch (NumberFormatException ignored) {}
                }
            }
        }

        long nextSeq = maxSeq + 1;
        String candidate = "TMA" + String.format("%04d", nextSeq);
        while (studentRepository.existsByStudentId(candidate) || userRepository.existsByUsername(candidate)) {
            nextSeq++;
            candidate = "TMA" + String.format("%04d", nextSeq);
        }
        return candidate;
    }

    private String generateInvoiceNumber() {
        String stamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "INV-" + stamp + "-" + (int) (Math.random() * 900 + 100);
    }
}
