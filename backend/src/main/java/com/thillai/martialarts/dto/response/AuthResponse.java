package com.thillai.martialarts.dto.response;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuthResponse {
    private String token;
    private String role;
    private String name;
    private String studentId; // null for admin
    private String username;  // null for student
}
