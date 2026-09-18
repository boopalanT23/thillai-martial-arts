package com.thillai.martialarts.dto.response;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentHistoryResponse {
    private Long id;
    private String date;
    private String month;
    private Integer amount;
    private String status;
    private String studentName;
    private String method;
}
