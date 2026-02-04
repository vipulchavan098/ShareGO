package com.sharego.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sharego.dtos.MakePaymentDTO;
import com.sharego.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<?> makePayment(
            @RequestBody @Valid MakePaymentDTO dto) {
        System.out.println("Payment Request: " + dto);

        return ResponseEntity.ok(
                paymentService.makePayment(dto));
    }
}
