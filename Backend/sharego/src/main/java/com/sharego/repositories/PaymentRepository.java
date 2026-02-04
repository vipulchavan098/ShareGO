package com.sharego.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sharego.entities.Payment;
import com.sharego.entities.PaymentStatus;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByUserId(Long userId);

    List<Payment> findByPaymentStatus(PaymentStatus status);

    List<Payment> findByBookingId(Long bookingId);
}
