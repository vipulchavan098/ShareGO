package com.sharego.service;

import com.sharego.dtos.ApiResponse;
import com.sharego.dtos.MakePaymentDTO;

public interface PaymentService {

    ApiResponse makePayment(MakePaymentDTO dto);
}
