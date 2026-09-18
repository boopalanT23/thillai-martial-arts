package com.thillai.martialarts.dto.response;

import lombok.*;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DueResponse {
    private Integer amount;
    private String month;
    private Integer totalMonthlyFee;
    private Integer paidAmount;
    private List<CourseFeeDetail> courseDetails;
}
