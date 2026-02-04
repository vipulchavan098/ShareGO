package com.sharego.service;

import java.util.List;

import com.sharego.dtos.ApiResponse;
import com.sharego.dtos.BookRideDTO;
import com.sharego.dtos.BookingDTO;

public interface BookingService {

    ApiResponse bookRide(BookRideDTO dto);

    List<BookingDTO> getPassengerBookings(Long passengerId);

    ApiResponse cancelBooking(Long bookingId, Long passengerId);

    List<BookingDTO> getDriverBookings(Long driverId);

    ApiResponse approveBooking(Long bookingId, Long driverId);

    ApiResponse rejectBooking(Long bookingId, Long driverId);
}
