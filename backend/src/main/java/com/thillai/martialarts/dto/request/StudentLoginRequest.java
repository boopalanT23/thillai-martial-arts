package com.thillai.martialarts.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class StudentLoginRequest {
    @NotBlank(message = "Student ID or mobile number is required")
    private String identifier;

    @NotBlank(message = "Password is required")
    private String password;
}
