package com.thillai.martialarts.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * Universal login request DTO for the unified Academy Portal.
 * Handles both student login (via Student ID or registered mobile)
 * and admin login (via username or email) along with the password.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {

    @NotBlank(message = "Username, Student ID, or mobile number is required")
    private String identifier;

    @NotBlank(message = "Password is required")
    private String password;

    /**
     * Optional portal role selector from the client tab: "STUDENT", "ADMIN", or null (auto-detect)
     */
    private String role;
}
