package com.thillai.martialarts.dto.response;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RegistrationResponse {
    private String studentId;
    private String name;
    private Integer totalFee;
    private String message;
}
