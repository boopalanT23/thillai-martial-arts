package com.thillai.martialarts.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

/**
 * Bound from multipart/form-data fields on POST /api/students/register
 * (photo and aadhaarPdf arrive as separate MultipartFile params).
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class StudentRegistrationRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private Integer age;

    @NotBlank(message = "Date of birth is required")
    private String dob; // yyyy-MM-dd

    @NotBlank(message = "Mobile number is required")
    private String mobile;

    @NotEmpty(message = "Select at least one course")
    private List<String> courses; // course slugs

    @NotBlank(message = "Joining date is required")
    private String joiningDate; // yyyy-MM-dd

    private String reason;

    @NotBlank(message = "Razorpay order ID is required")
    private String razorpayOrderId;

    @NotBlank(message = "Razorpay payment ID is required")
    private String razorpayPaymentId;

    @NotBlank(message = "Razorpay signature is required")
    private String razorpaySignature;

    @NotBlank(message = "Account password is required")
    @jakarta.validation.constraints.Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
