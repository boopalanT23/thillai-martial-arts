package com.thillai.martialarts.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.thillai.martialarts.dto.request.PaymentOrderRequest;
import com.thillai.martialarts.exception.BadRequestException;
import com.thillai.martialarts.exception.PaymentVerificationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RazorpayService {

    private final RazorpayClient razorpayClient;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    /**
     * Creates a Razorpay order.
     */
    public Order createOrder(PaymentOrderRequest request) {
        try {
            JSONObject orderRequest = new JSONObject();

            orderRequest.put("amount", request.getAmount());
            orderRequest.put("currency", request.getCurrency());
            orderRequest.put("receipt", request.getReceipt());

            if (request.getNotes() != null && !request.getNotes().isEmpty()) {

                JSONObject notes = new JSONObject();

                for (java.util.Map.Entry<String, String> entry
                        : request.getNotes().entrySet()) {

                    notes.put(
                            entry.getKey(),
                            entry.getValue()
                    );
                }

                orderRequest.put("notes", notes);
            }

            return razorpayClient.orders.create(orderRequest);

        } catch (Exception e) {
            log.error("Razorpay order creation failed", e);
            throw new BadRequestException(
                    "Could not initiate payment. Please try again."
            );
        }
    }

    /**
     * Converts Razorpay Order into the small JSON payload
     * required by the React frontend.
     */
    public JSONObject toCheckoutPayload(Order order) {

        JSONObject payload = new JSONObject();

        // IMPORTANT:
        // Store the returned values as Object first.
        // This prevents Java from selecting the wrong overloaded
        // String.valueOf(...) method.

        Object idObject = order.get("id");
        Object amountObject = order.get("amount");
        Object currencyObject = order.get("currency");

        String orderId = String.valueOf(idObject);
        String currency = String.valueOf(currencyObject);

        long amount;

        if (amountObject instanceof Number) {
            amount = ((Number) amountObject).longValue();
        } else {
            amount = Long.parseLong(String.valueOf(amountObject));
        }

        payload.put("id", orderId);
        payload.put("amount", amount);
        payload.put("currency", currency);

        return payload;
    }

    /**
     * Verifies the Razorpay payment signature.
     */
    public void verifySignature(
            String orderId,
            String paymentId,
            String signature
    ) {
        try {

            JSONObject attributes = new JSONObject();

            attributes.put(
                    "razorpay_order_id",
                    orderId
            );

            attributes.put(
                    "razorpay_payment_id",
                    paymentId
            );

            attributes.put(
                    "razorpay_signature",
                    signature
            );

            boolean isValid =
                    Utils.verifyPaymentSignature(
                            attributes,
                            keySecret != null ? keySecret.trim() : ""
                    );

            if (!isValid) {
                throw new PaymentVerificationException(
                        "Payment signature verification failed"
                );
            }

        } catch (PaymentVerificationException e) {

            throw e;

        } catch (Exception e) {

            log.error(
                    "Razorpay signature verification error",
                    e
            );

            throw new PaymentVerificationException(
                    "Could not verify payment signature"
            );
        }
    }
}