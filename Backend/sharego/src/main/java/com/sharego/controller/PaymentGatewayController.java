package com.sharego.controller;

import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.sharego.dtos.ApiResponse; // Assuming this exists
import com.sharego.dtos.MakePaymentDTO; // Reusing or new DTO
import com.sharego.service.PaymentService; // For saving payment
import lombok.RequiredArgsConstructor;
import java.util.Map;

@RestController
@RequestMapping("/pg")
@RequiredArgsConstructor
public class PaymentGatewayController {

    private final PaymentService paymentService;

    @org.springframework.beans.factory.annotation.Value("${razorpay.key.id}")
    private String KEY_ID;

    @org.springframework.beans.factory.annotation.Value("${razorpay.key.secret}")
    private String KEY_SECRET;

    @GetMapping("/key")
    public ResponseEntity<?> getRazorpayKey() {
        return ResponseEntity.ok(Map.of("key", KEY_ID));
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            double amount = Double.parseDouble(data.get("amount").toString());

            System.out.println("Creating Razorpay Order with Key: " + KEY_ID);

            RazorpayClient client = new RazorpayClient(KEY_ID, KEY_SECRET);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int) (amount * 100)); // amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_123456");

            Order order = client.orders.create(orderRequest);
            return ResponseEntity.ok(order.toString());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error creating order: " + e.getMessage());
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // This will be called AFTER Razorpay success to save in DB
    @PostMapping("/handle-payment")
    public ResponseEntity<?> handlePaymentSuccess(@RequestBody MakePaymentDTO dto) {
        // Verify signature here if needed, but for now just save to DB
        // In a real app, you MUST verify signature using KEY_SECRET
        return ResponseEntity.ok(paymentService.makePayment(dto));
    }
}
