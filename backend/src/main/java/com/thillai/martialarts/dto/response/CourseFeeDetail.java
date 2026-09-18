package com.thillai.martialarts.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseFeeDetail {
    private Long courseId;
    private String courseName;
    private String slug;
    private Integer fee;
    private String status; // "PAID" or "UNPAID"
    private String batchName;
}
