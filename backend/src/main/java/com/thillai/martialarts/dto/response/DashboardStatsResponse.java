package com.thillai.martialarts.dto.response;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardStatsResponse {
    private long totalStudents;
    private long totalRevenue;
    private long monthlyRevenue;
    private long pendingPayments;
    private List<Map<String, Object>> revenueTrend;        // [{month, revenue}]
    private List<Map<String, Object>> enrollmentByBatch;   // [{name, students}]
}
