package com.thillai.martialarts.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ContactRequest {
    @NotBlank private String name;
    @NotBlank private String phone;
    @NotBlank @Email private String email;
    @NotBlank private String city;
    @NotBlank private String state;
    @NotBlank private String message;
}
