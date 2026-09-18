package com.thillai.martialarts.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.Map;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PaymentOrderRequest {
    @Min(value = 100, message = "Amount must be at least ₹1 (100 paise)")
    private long amount; // in paise

    @NotBlank
    private String currency;

    @NotBlank
    private String receipt;

    private Map<String, String> notes;
}
