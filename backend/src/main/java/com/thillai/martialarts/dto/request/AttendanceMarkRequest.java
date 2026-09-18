package com.thillai.martialarts.dto.request;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AttendanceMarkRequest {
    private Long studentId;
    private Long batchId;
    private String date; // yyyy-MM-dd
    private String status; // PRESENT | ABSENT
}
