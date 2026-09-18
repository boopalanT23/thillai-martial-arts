package com.thillai.martialarts.config;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RazorpayConfig {

    @Value("${razorpay.key-id:rzp_test_TRvwtcq8ykZpwb}")
    private String keyId;

    @Value("${razorpay.key-secret:nAGsk45BzcreDZ2Vo5pbS6lf}")
    private String keySecret;

    @Bean
    public RazorpayClient razorpayClient() throws RazorpayException {
        String cleanId = (keyId != null && !keyId.isBlank()) ? keyId.trim() : "rzp_test_TRvwtcq8ykZpwb";
        String cleanSecret = (keySecret != null && !keySecret.isBlank()) ? keySecret.trim() : "nAGsk45BzcreDZ2Vo5pbS6lf";
        return new RazorpayClient(cleanId, cleanSecret);
    }
}
