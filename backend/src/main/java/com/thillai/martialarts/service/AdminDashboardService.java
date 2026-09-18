package com.thillai.martialarts.service;

import com.thillai.martialarts.dto.response.DashboardStatsResponse;
import com.thillai.martialarts.entity.Batch;
import com.thillai.martialarts.entity.Payment;
import com.thillai.martialarts.entity.PaymentStatus;
import com.thillai.martialarts.entity.Student;
import com.thillai.martialarts.repository.BatchRepository;
import com.thillai.martialarts.repository.PaymentRepository;
import com.thillai.martialarts.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final StudentRepository studentRepository;
    private final PaymentRepository paymentRepository;
    private final BatchRepository batchRepository;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboard() {
        List<Student> students = studentRepository.findAll();
        List<Payment> successfulPayments = paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
                .toList();

        long totalRevenue = successfulPayments.stream().mapToLong(Payment::getAmount).sum();

        String currentMonth = YearMonth.now().toString();
        long monthlyRevenue = successfulPayments.stream()
                .filter(p -> currentMonth.equals(p.getForMonth()))
                .mapToLong(Payment::getAmount).sum();

        Map<Long, Integer> paidByStudent = successfulPayments.stream()
                .filter(p -> currentMonth.equals(p.getForMonth()) && p.getStudent() != null)
                .collect(Collectors.groupingBy(p -> p.getStudent().getId(), Collectors.summingInt(Payment::getAmount)));

        long pendingPayments = students.stream()
                .filter(s -> {
                    int fee = s.getMonthlyFee() != null ? s.getMonthlyFee() : s.getCourses().stream().mapToInt(c -> c.getFeePerMonth() != null ? c.getFeePerMonth() : 0).sum();
                    int paid = paidByStudent.getOrDefault(s.getId(), 0);
                    return fee > 0 && paid < fee;
                })
                .count();

        return DashboardStatsResponse.builder()
                .totalStudents(students.size())
                .totalRevenue(totalRevenue)
                .monthlyRevenue(monthlyRevenue)
                .pendingPayments(pendingPayments)
                .revenueTrend(buildRevenueTrend(successfulPayments))
                .enrollmentByBatch(buildEnrollmentByBatch(students))
                .build();
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getMonthlyRevenue(int year) {
        List<Payment> payments = paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS && p.getForMonth() != null
                        && p.getForMonth().startsWith(String.valueOf(year)))
                .toList();

        Map<String, Long> byMonth = new TreeMap<>();
        for (Payment p : payments) {
            byMonth.merge(p.getForMonth(), (long) p.getAmount(), Long::sum);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, Long> e : byMonth.entrySet()) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("month", monthLabel(e.getKey()));
            row.put("revenue", e.getValue());
            result.add(row);
        }
        return result;
    }

    private List<Map<String, Object>> buildRevenueTrend(List<Payment> successfulPayments) {
        // Last 6 months including the current one, in chronological order
        List<YearMonth> months = new ArrayList<>();
        YearMonth cursor = YearMonth.now().minusMonths(5);
        for (int i = 0; i < 6; i++) {
            months.add(cursor);
            cursor = cursor.plusMonths(1);
        }

        Map<String, Long> revenueByMonth = successfulPayments.stream()
                .filter(p -> p.getForMonth() != null)
                .collect(Collectors.groupingBy(Payment::getForMonth, Collectors.summingLong(Payment::getAmount)));

        List<Map<String, Object>> trend = new ArrayList<>();
        for (YearMonth ym : months) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("month", ym.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
            row.put("revenue", revenueByMonth.getOrDefault(ym.toString(), 0L));
            trend.add(row);
        }
        return trend;
    }

    private List<Map<String, Object>> buildEnrollmentByBatch(List<Student> students) {
        List<Batch> batches = batchRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Batch batch : batches) {
            long count = students.stream()
                    .filter(s -> s.getBatch() != null && s.getBatch().getId().equals(batch.getId()))
                    .count();
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("name", batch.getName().split(" ")[0]);
            row.put("students", count);
            result.add(row);
        }
        return result;
    }

    private String monthLabel(String yearMonth) {
        YearMonth ym = YearMonth.parse(yearMonth);
        return ym.format(DateTimeFormatter.ofPattern("MMM yyyy"));
    }
}
