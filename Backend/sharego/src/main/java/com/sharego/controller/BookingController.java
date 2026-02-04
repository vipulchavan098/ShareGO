package com.sharego.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sharego.dtos.BookRideDTO;
import com.sharego.dtos.BookingDTO;
import com.sharego.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

        private final BookingService bookingService;

        @PostMapping
        public ResponseEntity<?> bookRide(
                        @RequestBody @Valid BookRideDTO dto) {

                return ResponseEntity.ok(
                                bookingService.bookRide(dto));
        }

        @GetMapping("/passenger/{passengerId}")
        public List<BookingDTO> getPassengerBookings(
                        @PathVariable Long passengerId) {

                return bookingService
                                .getPassengerBookings(passengerId);
        }

        @PutMapping("/cancel/{bookingId}/passenger/{passengerId}")
        public ResponseEntity<?> cancelBooking(
                        @PathVariable Long bookingId,
                        @PathVariable Long passengerId) {

                return ResponseEntity.ok(
                                bookingService.cancelBooking(
                                                bookingId,
                                                passengerId));
        }

        @GetMapping("/driver/{driverId}")
        public List<BookingDTO> getDriverBookings(
                        @PathVariable Long driverId) {

                return bookingService
                                .getDriverBookings(driverId);
        }

        @PutMapping("/{bookingId}/approve/driver/{driverId}")
        public ResponseEntity<?> approveBooking(
                        @PathVariable Long bookingId,
                        @PathVariable Long driverId) {
                System.out.println("DEBUG: Approve booking " + bookingId + " by driver " + driverId);
                return ResponseEntity.ok(
                                bookingService.approveBooking(
                                                bookingId,
                                                driverId));
        }

        @PutMapping("/{bookingId}/reject/driver/{driverId}")
        public ResponseEntity<?> rejectBooking(
                        @PathVariable Long bookingId,
                        @PathVariable Long driverId) {

                return ResponseEntity.ok(
                                bookingService.rejectBooking(
                                                bookingId,
                                                driverId));
        }
}
