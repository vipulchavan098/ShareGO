package com.sharego.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sharego.custom_exceptions.ResourceNotFoundException;
import com.sharego.dtos.ApiResponse;
import com.sharego.dtos.MakePaymentDTO;
import com.sharego.entities.Booking;
import com.sharego.entities.Payment;
import com.sharego.entities.PaymentStatus;
import com.sharego.repositories.BookingRepository;
import com.sharego.repositories.PaymentRepository;
import com.sharego.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentServiceImpl
                implements PaymentService {

        private final PaymentRepository paymentRepository;
        private final BookingRepository bookingRepository;
        private final UserRepository userRepository;

        @Override
        public ApiResponse makePayment(
                        MakePaymentDTO dto) {

                Booking booking = bookingRepository.findById(
                                dto.getBookingId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Invalid booking ID"));

                Payment payment = new Payment();

                payment.setAmount(dto.getAmount());
                payment.setPaymentDate(dto.getPaymentDate());
                payment.setPaymentStatus(
                                PaymentStatus.SUCCESS);

                booking.setBookingStatus(
                                com.sharego.entities.BookingStatus.PAID);

                payment.setBooking(booking);

                payment.setUser(
                                userRepository.findById(
                                                dto.getUserId())
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Invalid user ID")));

                paymentRepository.save(payment);

                return new ApiResponse(
                                "Payment successful",
                                "SUCCESS");
        }
}
